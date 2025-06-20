import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/shared/service/auth.service';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonFooter, IonButton, IonItem, IonLabel } from '@ionic/angular/standalone';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonToolbar, CommonModule, IonTitle, IonItem, IonLabel, IonFooter, IonButton, RouterModule]
})
export class ProfilePage {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  name: string | null = null;
  email: string | null = null;

  async ionViewWillEnter() {
    const user = await this.authService.getUser();
    this.name = user.full_name;
    this.email = user.email;
  }
  
  async onLogout() {
    this.authService.clearTokens();
    this.router.navigate(["/login"], { replaceUrl: true })
  }

  goToHome() {
    this.router.navigate(['/'], { replaceUrl: true })
  }

  goToEvents(event: string, replaceUrl: boolean) {
    this.router.navigate(['/events', event, { replaceUrl }])
  }
}
