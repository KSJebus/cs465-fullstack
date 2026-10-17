import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Trip } from '../models/trip';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';

// Talks to the Express REST API in app_api
@Injectable({
  providedIn: 'root'
})
export class TripData {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/api';
  private url = `${this.baseUrl}/trips`;

  // GET: /trips
  getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(this.url);
  }

  // GET: /trips/:tripCode (API returns an array with a single trip)
  getTrip(tripCode: string): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.url}/${tripCode}`);
  }

  // POST: /trips
  addTrip(formData: Trip): Observable<Trip> {
    return this.http.post<Trip>(this.url, formData);
  }

  // PUT: /trips/:tripCode
  updateTrip(tripCode: string, formData: Trip): Observable<Trip> {
    return this.http.put<Trip>(`${this.url}/${tripCode}`, formData);
  }

  // DELETE: /trips/:tripCode
  deleteTrip(tripCode: string): Observable<Trip> {
    return this.http.delete<Trip>(`${this.url}/${tripCode}`);
  }

  // POST: /login
  login(user: User, password: string): Observable<AuthResponse> {
    return this.handleAuthAPICall('login', user, password);
  }

  // POST: /register
  register(user: User, password: string): Observable<AuthResponse> {
    return this.handleAuthAPICall('register', user, password);
  }

  private handleAuthAPICall(endpoint: string, user: User, password: string): Observable<AuthResponse> {
    const formData = {
      name: user.name,
      email: user.email,
      password: password
    };
    return this.http.post<AuthResponse>(`${this.baseUrl}/${endpoint}`, formData);
  }
}
