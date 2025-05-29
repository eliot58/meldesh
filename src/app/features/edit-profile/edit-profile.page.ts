import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/shared/service/auth.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule, CommonModule, RouterModule]
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
