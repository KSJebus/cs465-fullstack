import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Router } from '@angular/router';

import { TripData } from '../services/trip-data';
import { Authentication } from '../services/authentication';
import { Trip } from '../models/trip';

@Component({
  selector: 'app-trip-card',
  imports: [DatePipe, CurrencyPipe],
  templateUrl: './trip-card.html',
  styleUrl: './trip-card.css'
})
export class TripCard {
  private router = inject(Router);
  private tripData = inject(TripData);
  private authentication = inject(Authentication);

  @Input({ required: true }) trip!: Trip;
  @Output() deleted = new EventEmitter<string>();

  // Images are served by the Express public site
  readonly imageBase = 'http://localhost:3000/images/';

  isLoggedIn(): boolean {
    return this.authentication.isLoggedIn();
  }

  editTrip(trip: Trip): void {
    this.router.navigate(['edit-trip', trip.code]);
  }

  deleteTrip(trip: Trip): void {
    if (!confirm(`Delete trip ${trip.code} (${trip.name})?`)) {
      return;
    }
    this.tripData.deleteTrip(trip.code).subscribe({
      next: () => this.deleted.emit(trip.code),
      error: (error: any) => console.log('Error: ' + error.message)
    });
  }
}
