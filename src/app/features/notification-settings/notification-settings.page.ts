import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-notification-settings',
  templateUrl: './notification-settings.page.html',
  styleUrls: ['./notification-settings.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class NotificationSettingsPage {

  notificationsEnabled = true;

  goBack() {

  }

}
