import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonInput, IonButton, IonHeader, IonButtons, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, IonInput, IonHeader, IonButtons, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule]
})
export class ChangePasswordPage {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  constructor(
    private fb: FormBuilder, 
    private http: HttpClient,
    private navCtrl: NavController,
    private router: Router
  ) {}

  goBack() {
    this.navCtrl.back()
  }

  onSubmit() {
    if (this.form.valid) {
      const url = 'https://meldesh.kg/api/v2/auth/password/reset/';

      const body = {
        email: this.form.value.email,
      };

      this.http.post(url, body).subscribe({
        next: (res) => this.router.navigate(["/password-reset", this.form.value.email]),
        error: (err) => alert("Ошибка при отправке запроса сброса пароля")
      });
    }
  }

}
