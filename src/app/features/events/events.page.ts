import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IonContent, IonInput, IonButton, IonHeader, IonFooter, IonToolbar, IonTitle } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/shared/service/auth.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
  standalone: true,
  imports: [IonContent, IonInput, IonButton,  IonHeader, IonFooter, IonToolbar, IonTitle, CommonModule, FormsModule, RouterModule]
})
export class EventsPage {
  events: any[] = [];
  type: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.type = this.route.snapshot.paramMap.get('type');
    if (this.type) {
      await this.fetchEvents(this.type);
    }
  }

  async fetchEvents(type: string) {

    const token = await this.authService.getAccessToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    let url = `https://meldesh.kg/api/v1/events/?limit=4&types_event=${type}`;

    if (type === 'favorite') {
      url = `https://meldesh.kg/api/v1/favorites?limit=4`;
    } else if (type === 'unviewed') {
      url = `https://meldesh.kg/api/v1/events/unviewed?limit=4`;
    }
    
    this.http.get<any>(url, { headers }).subscribe((response) => {
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

}
