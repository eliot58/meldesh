import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IonContent, IonButton, IonHeader, IonFooter, IonToolbar, IonButtons, IonTitle, Platform } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, IonHeader, IonFooter, IonToolbar, IonButtons, IonTitle, CommonModule, FormsModule]
})
export class EventPage implements OnInit {

  constructor(
    private route: ActivatedRoute, 
    private http: HttpClient, 
    private navCtrl: NavController,
    private platform: Platform
  ) {}

  event: any;

  backButtonSub?: Subscription;

  ngOnDestroy() {
    if (this.backButtonSub) {
      this.backButtonSub.unsubscribe();
    }
  }

  initBackButtonBehavior() {
    this.backButtonSub = this.platform.backButton.subscribeWithPriority(10, () => {
      this.navCtrl.back();
    });
  }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    this.http.get(`https://meldesh.kg/api/v1/events/${id}/`)
      .subscribe((event) => {
        this.event = event;
      });

    this.initBackButtonBehavior();
  }

  getEventTitle(type: string): string {
    switch (type) {
      case 'grant':
        return 'Стипендия';
      case 'internship':
        return 'Стажировка';
      case 'olympiad':
        return 'Олимпиада';
      default:
        return 'Курс';
    }
  }
  
  openExternalLink() {
    if (this.event.type_url) {
      this.linkTracked();
      window.open(this.event.type_url, '_blank');
    } else {
      console.warn('URL не найден');
    }
  }  

  goBack() {
    this.navCtrl.back();
  }

  async linkTracked() {
    const id = this.route.snapshot.paramMap.get('id');

    this.http.post(`https://meldesh.kg/api/v1/events/track/${id}/`, {})
  }

  async toggleFavorite() {
    const id = this.route.snapshot.paramMap.get('id');
  
    if (this.event.event_view.is_liked) {
      this.http.delete(`https://meldesh.kg/api/v1/favorites/remove/?event_id=${id}`)
        .subscribe(() => this.event.event_view.is_liked = false);
    } else {
      this.http.post(`https://meldesh.kg/api/v1/favorites/add/?event_id=${id}`, {})
        .subscribe(() => this.event.event_view.is_liked = true);
    }
  }
  
}
