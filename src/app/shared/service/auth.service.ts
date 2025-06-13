import { Injectable } from '@angular/core';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private storage = SecureStoragePlugin;

  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'user';

  constructor() { }

  toBase64Unicode(str: string): string {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    ));
  }

  fromBase64Unicode(base64: string): string {
    return decodeURIComponent(
      Array.from(atob(base64))
        .map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    );
  }


  async setAccessToken(token: string): Promise<void> {
    await this.storage.set({ key: this.ACCESS_TOKEN_KEY, value: token });
  }

  async getAccessToken(): Promise<string | null> {
    try {
      const { value } = await this.storage.get({ key: this.ACCESS_TOKEN_KEY });
      return value;
    } catch {
      return null;
    }
  }

  async setRefreshToken(token: string): Promise<void> {
    await this.storage.set({ key: this.REFRESH_TOKEN_KEY, value: token });
  }

  async getRefreshToken(): Promise<string | null> {
    try {
      const { value } = await this.storage.get({ key: this.REFRESH_TOKEN_KEY });
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
    const encoded = this.toBase64Unicode(JSON.stringify(user));
    await this.storage.set({ key: this.USER_KEY, value: encoded });
  }

  async getUser(): Promise<any | null> {
    try {
      const { value } = await this.storage.get({ key: this.USER_KEY });
      const decoded = JSON.parse(this.fromBase64Unicode(value));
      return decoded
    } catch {
      return null;
    }
  }

  async clearTokens(): Promise<void> {
    await this.storage.remove({ key: this.ACCESS_TOKEN_KEY });
    await this.storage.remove({ key: this.REFRESH_TOKEN_KEY });
    await this.storage.remove({ key: this.USER_KEY });
  }

  async isLoggedIn(): Promise<boolean> {
    const token = await this.getAccessToken();
    return !!token;
  }
}