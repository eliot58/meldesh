import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonButton,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonFooter,
  IonToolbar,
  IonInput,
  IonChip
} from '@ionic/angular/standalone';
import { IonicSlides } from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/shared/service/auth.service';

type TabType = 'internship' | 'grant' | 'olympiad';

interface PageState {
  items: any[];
  nextUrl: string | null;
  loading: boolean;
}

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonInput,
    IonButton,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonFooter,
    IonToolbar,
    CommonModule,
    FormsModule,
    RouterModule,
    IonChip
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MainPage implements OnInit {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) { }

  swiperModules = [IonicSlides];
  selectedTab: TabType = 'grant';
  isLoading = true;

  pageInfo: Record<TabType, PageState> = {
    internship: { items: [], nextUrl: null, loading: false },
    grant: { items: [], nextUrl: null, loading: false },
    olympiad: { items: [], nextUrl: null, loading: false },
  };

  events: any[] = [];
  pageSize = 6;
  name: string | null = null;

  // Поиск
  searchText: string = '';
  isSearchFocused: boolean = false;
  searchResults: any[] = [];
  searchDebounce: any;

  onSearchInput() {
    clearTimeout(this.searchDebounce);
    this.searchDebounce = setTimeout(async () => {
      if (this.searchText.trim()) {
        await this.fetchSearchResults(this.searchText.trim());
      } else {
        this.searchResults = [];
      }
    }, 500);
  }

  async fetchSearchResults(query: string) {
    let url = `https://meldesh.kg/api/v1/events/?limit=10&query=${encodeURIComponent(query)}`;
    if (this.selectedCategory !== 'all') {
      url += `&types_event=${encodeURIComponent(this.selectedCategory)}`;
    }

    this.http.get<any>(url).subscribe({
      next: (res) => {
        this.searchResults = res.results || [];
      },
      error: () => {
        this.searchResults = [];
      },
    });
  }

  onSearchBlur() {
    setTimeout(() => (this.isSearchFocused = false), 300);
  }

  showCategories = false;
  selectedCategory = 'all';

  toggleCategories() {
    this.showCategories = !this.showCategories;
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
  }

  get currentEvents() {
    return this.pageInfo[this.selectedTab].items;
  }

  ngOnInit() {
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

  loadPaginatedData(type: TabType, event?: any) {
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

  onInfiniteScroll(event: any) {
    const element = event.target;

    const threshold = 50;

    if (element.scrollHeight - element.scrollTop <= element.clientHeight + threshold) {
      this.loadPaginatedData(this.selectedTab);
    }
  }

  goToEvents(event: string, replaceUrl: boolean) {
    this.router.navigate(['/events', event, { replaceUrl }]);
  }

  goToProfile() {
    this.router.navigate(['/profile'], { replaceUrl: true });
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
