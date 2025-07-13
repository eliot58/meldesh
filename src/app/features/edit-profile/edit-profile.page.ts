import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from 'src/app/shared/service/auth.service';
import { IonicModule, NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

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
    private authService: AuthService,
    private navCtrl: NavController,
    private http: HttpClient
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

  async onSubmit() {
    if (this.form.invalid) return;

    const token = await this.authService.getAccessToken();
    if (!token) return;

    const body = {
      full_name: this.form.value.fullName,
      age: this.form.value.age,
      type: this.form.value.group,
    };

    this.http.put('https://meldesh.kg/api/v1/auth/user/', body)
      .subscribe({
        next: async (updatedUser) => {
          await this.authService.setUser(updatedUser);
          this.navCtrl.back();
        },
        error: (error) => {
          console.error('Ошибка при обновлении профиля:', error);
        }
      });
  }


  goBack() {
    this.navCtrl.back();
  }
}
