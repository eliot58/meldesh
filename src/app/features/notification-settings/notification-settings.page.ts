import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonButtons, IonTitle, IonCard, IonCardHeader, IonCardContent, IonItem, IonCardTitle, IonLabel, IonList } from '@ionic/angular/standalone';
import { IonicModule, NavController } from '@ionic/angular';

@Component({
  selector: 'app-notification-settings',
  templateUrl: './notification-settings.page.html',
  styleUrls: ['./notification-settings.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class NotificationSettingsPage {

  constructor(private navCtrl: NavController,) {}

  notificationsEnabled = true;

  goBack() {
    this.navCtrl.back()
  }

}
