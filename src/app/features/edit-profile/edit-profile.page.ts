import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from 'src/app/shared/service/auth.service';
import { IonContent, IonHeader, IonToolbar, IonButtons, IonTitle, IonButton, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule, IonicModule]
})
export class EditProfilePage implements OnInit {
  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) { }

  form = this.fb.group({
    fullName: ['', Validators.required],
    age: ['', [Validators.required, Validators.min(1)]],
    email: ['', [Validators.required, Validators.email]],
    group: ['', Validators.required],
  });

  async ngOnInit() {
    const user = await this.authService.getUser();
    
    if (user) {
      this.form.patchValue({
        fullName: user.full_name || '',
        age: user.age || '',
        email: user.email || '',
        group: user.type || '',
      });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }

  goBack() {

  }
}
