import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IonContent, IonInput, IonButton, IonHeader, IonFooter, IonToolbar, IonTitle } from '@ionic/angular/standalone';

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
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.type = this.route.snapshot.paramMap.get('type');
    if (this.type) {
      this.fetchEvents(this.type);
    }
  }

  fetchEvents(type: string) {
    const url = `http://109.73.194.192:8000/api/v1/events/?limit=4&types_event=${type}`;
    this.http.get<any>(url).subscribe((response) => {
      this.events = response.results || response;
    });
  }

}
