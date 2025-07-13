import {
  Component, QueryList, ViewChild, ViewChildren,
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

  @ViewChildren(HomePage) homePages!: QueryList<HomePage>;
  @ViewChildren(EventsPage) eventsPages!: QueryList<EventsPage>;
  @ViewChildren(ProfilePage) profilePages!: QueryList<ProfilePage>;

  ngAfterViewInit() {
    this.callViewWillEnter(this.selectedTab);
  }

  async selectTab(tab: 'home' | 'course' | 'profile') {
    this.selectedTab = tab;

    setTimeout(() => {
      this.callViewWillEnter(tab);
    });
  }

  private async callViewWillEnter(tab: string) {
    switch (tab) {
      case 'home':
        this.homePages.first?.init?.();
        break;
      case 'course':
        await this.eventsPages.first?.init?.('course');
        break;
      case 'profile':
        await this.profilePages.first?.init?.();
        break;
    }
  }
}
