import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IonicSlides } from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { AuthService } from 'src/app/shared/service/auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MainPage implements OnInit {

  swiperModules = [IonicSlides];

  selectedTab: string = 'grant';

  events: any[] = [];
  internships: any[] = [];
  olympiads: any[] = [];
  grants: any[] = [];

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.fetchAllEvents();
  }

  async fetchAllEvents() {
    const token = await this.authService.getAccessToken();
    if (!token) return;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const event$ = this.http.get<any>('http://109.73.194.192:8000/api/v1/events/?limit=4&types_event=event', { headers });
    const internship$ = this.http.get<any>('http://109.73.194.192:8000/api/v1/events/?limit=4&types_event=internship', { headers });
    const olympiad$ = this.http.get<any>('http://109.73.194.192:8000/api/v1/events/?limit=4&types_event=olympiad', { headers });
    const grant$ = this.http.get<any>('http://109.73.194.192:8000/api/v1/events/?limit=4&types_event=grant', { headers });

    forkJoin([event$, internship$, olympiad$, grant$]).subscribe(([eventRes, internshipRes, olympiadRes, grantRes]) => {
      this.events = eventRes.results || [];
      this.internships = internshipRes.results || [];
      this.olympiads = olympiadRes.results || [];
      this.grants = grantRes.results || [];
    });
  }

  get currentEvents() {
    switch (this.selectedTab) {
      case 'internship': return this.internships;
      case 'olympiad': return this.olympiads;
      case 'grant': return this.grants;
      default: return [];
    }
  }
}
