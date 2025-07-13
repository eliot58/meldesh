import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonInput, IonButton } from '@ionic/angular/standalone';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.page.html',
  styleUrls: ['./verify.page.scss'],
  standalone: true,
  imports: [IonContent, IonInput, IonButton, CommonModule, FormsModule, ReactiveFormsModule]
})
export class VerifyPage {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {}
  
  onSubmit() {
    if (this.form.valid) {
      const { email } = this.form.value;

      this.http.post('https://meldesh.kg/api/v1/auth/registration/resend-email/', { email })
        .subscribe({
          next: (response) => alert("Успешно переотправлено"),
          error: (error) => console.log(error)
      });
    }
  }

  goToLogin() {
    this.router.navigate(['/login'], { replaceUrl: true })
  }
}
