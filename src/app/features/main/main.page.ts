import {
  Component,
} from '@angular/core';
import {
  IonContent,
  IonFooter,
  IonToolbar,
  IonButton
} from '@ionic/angular/standalone';
import { HomePage } from '../home/home.page';
import { ProfilePage } from '../profile/profile.page';
import { EventsPage } from '../events/events.page';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonFooter,
    IonToolbar,
    IonButton,
    CommonModule,
    HomePage,
    EventsPage,
    ProfilePage
  ],
})
export class MainPage {
  selectedTab: 'home' | 'course' | 'profile' = 'home';

  selectTab(tab: 'home' | 'course' | 'profile') {
    this.selectedTab = tab;
  }
}
