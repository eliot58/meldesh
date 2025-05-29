import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.page.html',
  styleUrls: ['./password-reset.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class PasswordResetPage {
  showPassword = false;

  form = this.fb.group({
    code: ['', Validators.required],
    password: ['', Validators.required],
    passwordConfirm: ['', Validators.required],
  });

  constructor(private fb: FormBuilder) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }
}
