import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonButtons, IonTitle, IonCard, IonCardHeader, IonCardContent, IonItem, IonCardTitle, IonLabel, IonList } from '@ionic/angular/standalone';

@Component({
  selector: 'app-notification-settings',
  templateUrl: './notification-settings.page.html',
  styleUrls: ['./notification-settings.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonToolbar, IonButtons, IonTitle,  IonCard, IonCardHeader, IonCardContent, IonItem, IonCardTitle, IonLabel, IonList, CommonModule, FormsModule]
})
export class NotificationSettingsPage {

  notificationsEnabled = true;

  goBack() {

  }

}
