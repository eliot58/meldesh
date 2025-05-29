import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/shared/service/auth.service';
import { Router } from '@angular/router';
import { IonContent, IonInput, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, IonInput, CommonModule, FormsModule, ReactiveFormsModule]
})
export class LoginPage {
  showPassword = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  constructor(private fb: FormBuilder, private http: HttpClient, private authService: AuthService, private router: Router) { }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.form.valid) {
      const formData = this.form.value;

      this.http.post('http://109.73.194.192:8000/api/v1/auth/login/', formData)
        .subscribe({
          next: async (response: any) => {
            const { access, refresh, user } = response;
            await this.authService.setAccessToken(access);
            await this.authService.setRefreshToken(refresh);
            await this.authService.setUser(user)
            this.router.navigate(['/'])
          },
          error: (error) => {
            console.error('Login failed:', error);
          }
        });
    }
  }
}
