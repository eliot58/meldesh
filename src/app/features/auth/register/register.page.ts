import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonInput, IonSelect, IonButton, IonSelectOption } from '@ionic/angular/standalone';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonContent, IonInput, IonSelect, IonSelectOption, IonButton, CommonModule, FormsModule, ReactiveFormsModule]
})
export class RegisterPage {
  showPassword = false;

  serverErrors: { [key: string]: string[] } = {};

  form = this.fb.group({
    fullName: ['', Validators.required],
    age: ['', [Validators.required, Validators.min(1)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    passwordConfirm: ['', Validators.required],
    group: ['', Validators.required],
  }, { validators: this.passwordsMatchValidator });


  passwordsMatchValidator(form: any) {
    const password = form.get('password')?.value;
    const confirm = form.get('passwordConfirm')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) { }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.serverErrors = {};

    if (this.form.valid) {
      const value = this.form.value;
      const body = {
        email: value.email,
        password1: value.password,
        password2: value.passwordConfirm,
        full_name: value.fullName,
        age: value.age,
        type: value.group
      };

      this.http.post('https://meldesh.kg/api/v1/auth/registration/', body).subscribe({
        next: () => this.router.navigate(['/verify']),
        error: (error) => {
          if (error.status === 400 && error.error) {
            this.serverErrors = error.error; 
          }
        }
      });
    }
  }

  goToLogin() {
    this.router.navigate(['/login'], { replaceUrl: true })
  }
}
