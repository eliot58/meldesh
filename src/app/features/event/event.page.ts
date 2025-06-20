import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/shared/service/auth.service';
import { IonContent, IonButton, IonHeader, IonFooter, IonToolbar, IonButtons, IonTitle } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';

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
    private authService: AuthService
  ) {}

  event: any;

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    const token = await this.authService.getAccessToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http.get(`https://meldesh.kg/api/v1/events/${id}/`, { headers })
      .subscribe((event) => {
        this.event = event;
      });
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
      window.open(this.event.type_url, '_blank');
    } else {
      console.warn('URL не найден');
    }
  }  

  goBack() {
    this.navCtrl.back();
  }
}
