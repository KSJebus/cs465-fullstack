import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { BROWSER_STORAGE } from '../storage';
import { TripData } from './trip-data';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';

// Owns the JWT: stores it, reads it, and decodes it to answer "who is logged in?"
@Injectable({
  providedIn: 'root'
})
export class Authentication {
  private storage = inject(BROWSER_STORAGE);
  private tripData = inject(TripData);

  private readonly tokenKey = 'travlr-token';

  getToken(): string {
    return this.storage.getItem(this.tokenKey) ?? '';
  }

  saveToken(token: string): void {
    this.storage.setItem(this.tokenKey, token);
  }

  logout(): void {
    this.storage.removeItem(this.tokenKey);
  }

  // Logged in means we hold a token whose expiry is still in the future
  isLoggedIn(): boolean {
    const payload = this.decodeToken();
    return !!payload && payload.exp > Date.now() / 1000;
  }

  getCurrentUser(): User | null {
    if (!this.isLoggedIn()) {
      return null;
    }
    const { email, name } = this.decodeToken();
    return { email, name } as User;
  }

  login(user: User, password: string): Observable<AuthResponse> {
    return this.tripData
      .login(user, password)
      .pipe(tap((authResp: AuthResponse) => this.saveToken(authResp.token)));
  }

  register(user: User, password: string): Observable<AuthResponse> {
    return this.tripData
      .register(user, password)
      .pipe(tap((authResp: AuthResponse) => this.saveToken(authResp.token)));
  }

  // The JWT payload is the base64url-encoded middle segment
  private decodeToken(): any {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
    } catch {
      return null;
    }
  }
}
