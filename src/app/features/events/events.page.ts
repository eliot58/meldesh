import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IonContent, IonButton, IonHeader, IonFooter, IonToolbar, IonTitle, IonInput, IonButtons } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton,  IonHeader, IonFooter, IonToolbar, IonTitle, IonInput, CommonModule, FormsModule, RouterModule, IonButtons]
})
export class EventsPage {
  events: any[] = [];
  type: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private navCtrl: NavController
  ) {}

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
    
    if (this.type === 'course' || this.type === 'event') {
      url += `&types_event=${this.type}`;
    }
    
    this.http.get<any>(url).subscribe({
      next: (res: any) => {
        this.searchResults = res.results || [];
      },
      error: () => {
        this.searchResults = [];
      }
    });
  }
  

  onSearchBlur() {
    setTimeout(() => this.isSearchFocused = false, 300);
  }

  async ngOnInit() {
    this.type = this.route.snapshot.paramMap.get('type');
    if (this.type) {
      await this.fetchEvents(this.type);
    }
  }

  async fetchEvents(type: string) {

    let url = `https://meldesh.kg/api/v1/events/?limit=10&types_event=${type}`;

    if (type === 'favorite') {
      url = `https://meldesh.kg/api/v1/favorites?limit=10`;
    } else if (type === 'unviewed') {
      url = `https://meldesh.kg/api/v1/events/unviewed?limit=10`;
    }
    
    this.http.get<any>(url).subscribe((response) => {
      this.events = response.results || response;
    });
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
    this.router.navigate(['/'], { replaceUrl: true })
  }

  goToProfile() {
    this.router.navigate(['/profile'], { replaceUrl: true })
  }

  goBack() {
    this.navCtrl.back()
  }

}
