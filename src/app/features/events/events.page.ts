import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {
  IonContent,
  IonButton,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonInput,
  IonButtons,
  Platform,
  NavController,
} from '@ionic/angular/standalone';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonInput,
    IonButtons,
    CommonModule,
    FormsModule,
    RouterModule,
  ],
})
export class EventsPage implements OnDestroy {
  events: any[] = [];
  searchResults: any[] = [];
  searchText: string = '';
  searchMode: boolean = false;
  searchDebounce: any;

  type: string | null = null;
  pageSize = 8;
  nextUrl: string | null = null;
  loading = false;

  backButtonSub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private navCtrl: NavController,
    private platform: Platform
  ) { }

  ngOnDestroy() {
    if (this.backButtonSub) {
      this.backButtonSub.unsubscribe();
    }
  }

  ionViewWillEnter() {
    this.type = this.route.snapshot.paramMap.get('type');

    this.nextUrl = null;
    this.events = [];

    if (this.type) {
      this.fetchEvents(this.type);
    }
    this.initBackButtonBehavior();
  }

  async init(type: string) {
    this.type = type;

    this.nextUrl = null;
    this.events = [];

    if (this.type) {
      await this.fetchEvents(this.type);
    }
    this.initBackButtonBehavior();
  }

  initBackButtonBehavior() {
    this.backButtonSub = this.platform.backButton.subscribeWithPriority(10, () => {
      if (this.searchMode) {
        this.searchMode = false;
      } else {
        if (['event', 'favorite', 'unviewed'].includes(this.type!)) {
          this.navCtrl.back();
        }
      }
    });
  }

  onSearchInput() {
    clearTimeout(this.searchDebounce);
    this.searchDebounce = setTimeout(() => {
      const query = this.searchText.trim();
      if (query) {
        this.fetchSearchResults(query);
      } else {
        this.searchResults = [];
      }
    }, 500);
  }

  fetchSearchResults(query: string) {
    let url = `https://meldesh.kg/api/v1/events/?limit=8&query=${encodeURIComponent(query)}`;

    if (this.type === 'course' || this.type === 'event') {
      url += `&types_event=${this.type}`;
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

  fetchEvents(type: string, append = false): Promise<void> {
    this.loading = true;

    let url = this.nextUrl || `https://meldesh.kg/api/v1/events/?limit=${this.pageSize}&types_event=${type}`;

    if (type === 'favorite') {
      url = this.nextUrl || `https://meldesh.kg/api/v1/favorites?limit=${this.pageSize}`;
    } else if (type === 'unviewed') {
      url = this.nextUrl || `https://meldesh.kg/api/v1/events/unviewed?limit=${this.pageSize}`;
    }

    return new Promise((resolve) => {
      this.http.get<any>(url).subscribe({
        next: (res) => {
          const results = res.results;
          this.events = append ? [...this.events, ...results] : results;
          this.nextUrl = res.next || null;
          this.loading = false;
          resolve();
        },
        error: () => {
          this.loading = false;
          resolve();
        },
      });
    });
  }

  onScroll(event: any) {
    const el = event.target;
    if (this.loading || !this.nextUrl) return;

    const threshold = 100;
    if (el.scrollHeight - el.scrollTop <= el.clientHeight + threshold) {
      this.fetchEvents(this.type!, true);
    }
  }


  getEventsTitle(): string {
    switch (this.type) {
      case 'event':
        return 'Мероприятия';
      case 'favorite':
        return 'Избранные';
      case 'unviewed':
        return 'Не просмотренные';
      default:
        return 'Курсы';
    }
  }

  goToHome() {
    this.router.navigate(['/'], { replaceUrl: true });
  }

  goToProfile() {
    this.router.navigate(['/profile'], { replaceUrl: true });
  }

  goBack() {
    this.navCtrl.back();
  }
}