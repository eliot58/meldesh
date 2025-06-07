import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonInput, IonButton } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.page.html',
  styleUrls: ['./password-reset.page.scss'],
  standalone: true,
  imports: [IonContent, IonInput, IonButton, CommonModule, FormsModule, ReactiveFormsModule]
})
export class PasswordResetPage {
  email: string | null = null;
  showPassword = false;

  form = this.fb.group({
    code: ['', Validators.required],
    password: ['', Validators.required],
    passwordConfirm: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder, 
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.email = this.route.snapshot.paramMap.get('email');
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.form.valid && this.email) {
      const body = {
        code: this.form.value.code,
        password: this.form.value.password,
        password2: this.form.value.passwordConfirm,
        email: this.email
      };

      this.http.post('https://meldesh.kg/api/v2/auth/password/reset/confirm/', body)
        .subscribe({
          next: (res) => {
            alert("Пароль успешно сброшен")
            this.router.navigate(["/login"])
          },
          error: (err) => alert("Ошибка при сбросе пароля")
        });
    }
  }
}
