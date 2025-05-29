import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class ChangePasswordPage {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  constructor(private fb: FormBuilder) {}

  goBack() {
    
  }

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }

}
