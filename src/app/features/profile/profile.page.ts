import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/shared/service/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, RouterModule]
})
export class ProfilePage {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}
  
  async onLogout() {
    this.authService.clearTokens();
    this.router.navigate(["/login"])
  }
  
}
