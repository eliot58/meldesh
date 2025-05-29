import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
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
    private authService: AuthService
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

    let url = `http://109.73.194.192:8000/api/v1/events/?limit=4&types_event=${type}`;

    if (type === 'favorite') {
      url = `http://109.73.194.192:8000/api/v1/favorites?limit=4`;
    } else if (type === 'unviewed') {
      url = `http://109.73.194.192:8000/api/v1/events/unviewed?limit=4`;
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

}
