import { Routes } from '@angular/router';
import { authGuard } from './shared/guard/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'password-reset/:email',
    loadComponent: () => import('./features/auth/password-reset/password-reset.page').then( m => m.PasswordResetPage)
  },
  {
    path: 'verify',
    loadComponent: () => import('./features/auth/verify/verify.page').then( m => m.VerifyPage)
  },
  {
    path: 'change-password',
    loadComponent: () => import('./features/auth/change-password/change-password.page').then( m => m.ChangePasswordPage)
  },
  {
    path: '',
    loadComponent: () => import('./features/main/main.page').then( m => m.MainPage),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/profile.page').then( m => m.ProfilePage),
    canActivate: [authGuard]
  },
  {
    path: 'events/:type',
    loadComponent: () => import('./features/events/events.page').then( m => m.EventsPage),
    canActivate: [authGuard]
  },
  {
    path: 'edit-profile',
    loadComponent: () => import('./features/edit-profile/edit-profile.page').then( m => m.EditProfilePage),
    canActivate: [authGuard]
  },
  {
    path: 'notification-settings',
    loadComponent: () => import('./features/notification-settings/notification-settings.page').then( m => m.NotificationSettingsPage)
  },
  {
    path: 'event/:id',
    loadComponent: () => import('./features/event/event.page').then( m => m.EventPage),
    canActivate: [authGuard]
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.page').then( m => m.HomePage)
  }
];
