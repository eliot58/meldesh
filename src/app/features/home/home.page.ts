import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  ElementRef,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/shared/service/auth.service';
import { Router, RouterModule } from '@angular/router';
import {
  IonContent,
  IonButton,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonInput,
  Platform,
  IonicSlides,
} from '@ionic/angular/standalone';
import { Subscription } from 'rxjs';
import {
  ActionPerformed,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';

type TabType = 'internship' | 'grant' | 'olympiad';

interface PageState {
  items: any[];
  nextUrl: string | null;
  loading: boolean;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonInput,
    IonButton,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomePage implements OnDestroy {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private platform: Platform
  ) {}

  // Slides
  swiperModules = [IonicSlides];
  @ViewChild('swiperRef') swiperRef: ElementRef | undefined;
  tabOrder: TabType[] = ['grant', 'internship', 'olympiad'];
  selectedTab: TabType = 'grant';

  // Page state
  isLoading = true;
  pageSize = 8;
  name: string | null = null;

  pageInfo: Record<TabType, PageState> = {
    internship: { items: [], nextUrl: null, loading: false },
    grant: { items: [], nextUrl: null, loading: false },
    olympiad: { items: [], nextUrl: null, loading: false },
  };

  unviewedInfo = {
    internship: 0,
    grant: 0,
    olympiad: 0,
    event: 0,
    course: 0,
  };

  events: any[] = [];

  // Search
  searchText: string = '';
  searchMode: boolean = false;
  searchResults: any[] = [];
  searchNextUrl: string | null = null;
  searchLoading = false;
  searchDebounce: any;
  selectedCategory = 'all';
  showCategories = false;

  // Back button
  backButtonSub?: Subscription;

  // Lifecycle
  ngOnDestroy() {
    if (this.backButtonSub) {
      this.backButtonSub.unsubscribe();
    }
  }

  init() {
    this.loadData();
    this.initBackButtonBehavior();
    this.initPushNotifications();
  }

  // Navigation helpers
  getTabIndex(tab: TabType): number {
    return this.tabOrder.indexOf(tab);
  }

  getTabByIndex(index: number): TabType {
    return this.tabOrder[index];
  }

  onSegmentChanged() {
    const index = this.getTabIndex(this.selectedTab);
    this.swiperRef?.nativeElement.swiper.slideTo(index);
  }

  onSlideChanged() {
    const index = this.swiperRef?.nativeElement.swiper.activeIndex ?? 0;
    this.selectedTab = this.getTabByIndex(index);
  }

  // Category toggles
  toggleCategories() {
    this.showCategories = !this.showCategories;
  }

  selectCategory(category: string) {
    this.searchMode = true;
    this.selectedCategory = category;
    this.onSearchInput();
  }

  // Search handlers
  onSearchFocus() {
    this.searchMode = true;
    this.onSearchInput();
  }

  onSearchInput() {
    clearTimeout(this.searchDebounce);
    this.searchDebounce = setTimeout(async () => {
      await this.fetchSearchResults(this.searchText.trim());
    }, 500);
  }

  async fetchSearchResults(query: string) {
    let url = `https://meldesh.kg/api/v1/events/?limit=${this.pageSize}&query=${encodeURIComponent(query)}`;

    if (this.selectedCategory !== 'all') {
      url += `&types_event=${encodeURIComponent(this.selectedCategory)}`;
    }

    this.http.get<any>(url).subscribe({
      next: (res) => {
        this.searchResults = res.results || [];
        this.searchNextUrl = res.next;
        this.searchLoading = false;
      },
      error: () => {
        this.searchResults = [];
        this.searchNextUrl = null;
        this.searchLoading = false;
      },
    });
  }

  onSearchScroll(event: any) {
    const element = event.target;
    const threshold = 50;

    if (element.scrollHeight - element.scrollTop <= element.clientHeight + threshold) {
      this.loadMoreSearchData();
    }
  }

  loadMoreSearchData() {
    if (this.searchLoading || !this.searchNextUrl) return;

    this.searchLoading = true;

    this.http.get<any>(this.searchNextUrl).subscribe({
      next: (res) => {
        const newResults = res.results || [];
        this.searchResults.push(...newResults);
        this.searchNextUrl = res.next;
        this.searchLoading = false;
      },
      error: () => {
        this.searchLoading = false;
      },
    });
  }

  // Data init and pagination
  loadData() {
    this.authService.getUser().then((user) => {
      this.name = user.full_name;

      (['internship', 'grant', 'olympiad'] as TabType[]).forEach((type) => {
        this.initFirstPage(type);
      });

      this.http
        .get<any>(`https://meldesh.kg/api/v1/events/?limit=${this.pageSize}&types_event=event`)
        .subscribe({
          next: (res) => {
            this.events = res.results || [];
          },
        });

      this.http
        .get<any>(`https://meldesh.kg/api/v1/events/unviewed_count`)
        .subscribe({
          next: (res) => {
            this.unviewedInfo = {
              internship: res.internship,
              grant: res.grant,
              course: res.course,
              event: res.event,
              olympiad: res.olympiad,
            };
          },
        });

      this.isLoading = false;
    });
  }

  initFirstPage(type: TabType) {
    const url = `https://meldesh.kg/api/v1/events/?limit=${this.pageSize}&types_event=${type}`;
    this.pageInfo[type].loading = true;

    this.http.get<any>(url).subscribe({
      next: (res) => {
        this.pageInfo[type].items = res.results || [];
        this.pageInfo[type].nextUrl = res.next;
        this.pageInfo[type].loading = false;
      },
      error: () => {
        this.pageInfo[type].loading = false;
      },
    });
  }

  onTabScroll(event: any) {
    const element = event.target;
    const threshold = 50;

    if (element.scrollHeight - element.scrollTop <= element.clientHeight + threshold) {
      this.loadMoreTabData(this.selectedTab);
    }
  }

  loadMoreTabData(type: TabType, event?: any) {
    const pageData = this.pageInfo[type];

    if (pageData.loading || pageData.nextUrl === null) {
      if (event) event.target.complete();
      return;
    }

    pageData.loading = true;

    this.http.get<any>(pageData.nextUrl!).subscribe({
      next: (res) => {
        const newItems = res.results || [];
        pageData.items.push(...newItems);
        pageData.nextUrl = res.next;
        pageData.loading = false;
        if (event) event.target.complete();
      },
      error: () => {
        pageData.loading = false;
        if (event) event.target.complete();
      },
    });
  }

  // Push notifications
  initPushNotifications() {
    PushNotifications.requestPermissions().then((result) => {
      if (result.receive === 'granted') {
        PushNotifications.register();
      } else {
        alert('Push permission not granted');
      }
    });

    PushNotifications.addListener('registration', (token: Token) => {
      this.sendDeviceTokenToBackend(token.value);
    });

    PushNotifications.addListener('registrationError', (error: any) => {
      alert('Error on registration: ' + JSON.stringify(error));
    });

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        this.router.navigate(['/event', notification.notification.data.event_id]);
      }
    );
  }

  private sendDeviceTokenToBackend(token: string) {
    const apiUrl = 'https://meldesh.kg/api/v1/devices/token/';
    this.http.post(apiUrl, { device_token: token }).subscribe({
      next: (res) => console.log('Device token sent successfully', res),
      error: (err) => console.error('Failed to send device token', err),
    });
  }

  // Back button
  initBackButtonBehavior() {
    this.backButtonSub = this.platform.backButton.subscribeWithPriority(10, () => {
      if (this.searchMode) {
        this.searchMode = false;
      }
    });
  }

  // UI logic
  get hasUnviewedEvents(): boolean {
    return Object.values(this.unviewedInfo).some((count) => count > 0);
  }

  goToEvents(event: string, replaceUrl: boolean) {
    this.router.navigate(['/events', event, { replaceUrl }]);
  }

  goToEvent(event: any) {
    const key = event.types_event as keyof typeof this.unviewedInfo;

    if (!event.event_view) {
      event.event_view = {
        is_liked: false,
        is_viewed: true,
      };
    } else if (!event.event_view.is_viewed) {
      event.event_view.is_viewed = true;
    }

    this.unviewedInfo[key] = Math.max(0, this.unviewedInfo[key] - 1);
    this.router.navigate(['/event', event.event_id]);
  }

  toggleFavorite(event: any) {
    const id = event.event_id;

    if (event.event_view?.is_liked) {
      this.http
        .delete(`https://meldesh.kg/api/v1/favorites/remove/?event_id=${id}`)
        .subscribe({
          next: () => (event.event_view.is_liked = false),
          error: (err) => console.error('Ошибка удаления из избранного', err),
        });
    } else {
      this.http
        .post(`https://meldesh.kg/api/v1/favorites/add/?event_id=${id}`, {})
        .subscribe({
          next: () => {
            if (!event.event_view) event.event_view = {};
            event.event_view.is_liked = true;
          },
          error: (err) => console.error('Ошибка добавления в избранное', err),
        });
    }
  }
}