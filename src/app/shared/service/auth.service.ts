import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'user';

  async setAccessToken(token: string): Promise<void> {
    await Preferences.set({ key: this.ACCESS_TOKEN_KEY, value: token });
  }

  async getAccessToken(): Promise<string | null> {
    try {
      const { value } = await Preferences.get({ key: this.ACCESS_TOKEN_KEY });
      return value;
    } catch {
      return null;
    }
  }

  async setRefreshToken(token: string): Promise<void> {
    await Preferences.set({ key: this.REFRESH_TOKEN_KEY, value: token });
  }

  async getRefreshToken(): Promise<string | null> {
    try {
      const { value } = await Preferences.get({ key: this.REFRESH_TOKEN_KEY });
      return value;
    } catch {
      return null;
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<string> {
    const response = await fetch('https://meldesh.kg/api/v1/auth/token/refresh/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Unable to refresh token');
    }

    const data = await response.json();
    const newAccess = data.access;
    await this.setAccessToken(newAccess);
    return newAccess;
  }


  async setUser(user: any): Promise<void> {
    const encoded = JSON.stringify(user);
    await Preferences.set({ key: this.USER_KEY, value: encoded });
  }

  async getUser(): Promise<any | null> {
    try {
      const { value } = await Preferences.get({ key: this.USER_KEY });
      const decoded = JSON.parse(value!);
      return decoded
    } catch {
      return null;
    }
  }

  async clearTokens(): Promise<void> {
    await Preferences.remove({ key: this.ACCESS_TOKEN_KEY });
    await Preferences.remove({ key: this.REFRESH_TOKEN_KEY });
    await Preferences.remove({ key: this.USER_KEY });
  }

  async isLoggedIn(): Promise<boolean> {
    const token = await this.getAccessToken();
    return !!token;
  }
}