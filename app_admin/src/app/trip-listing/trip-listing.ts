import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

import { TripCard } from '../trip-card/trip-card';
import { TripData } from '../services/trip-data';
import { Authentication } from '../services/authentication';
import { Trip } from '../models/trip';

@Component({
  selector: 'app-trip-listing',
  imports: [TripCard],
  templateUrl: './trip-listing.html',
  styleUrl: './trip-listing.css'
})
export class TripListing implements OnInit {
  private tripData = inject(TripData);
  private router = inject(Router);
  private authentication = inject(Authentication);

  trips: Trip[] = [];
  message = '';

  ngOnInit(): void {
    this.getTrips();
  }

  isLoggedIn(): boolean {
    return this.authentication.isLoggedIn();
  }

  addTrip(): void {
    this.router.navigate(['add-trip']);
  }

  // Remove a deleted trip from the list without refetching
  onTripDeleted(tripCode: string): void {
    this.trips = this.trips.filter(t => t.code !== tripCode);
    this.message = `Trip ${tripCode} deleted.`;
  }

  private getTrips(): void {
    this.message = 'Searching for trips';
    this.tripData.getTrips().subscribe({
      next: (value: Trip[]) => {
        this.trips = value;
        this.message = `There are ${value.length} trips available.`;
      },
      error: (error: any) => {
        // API returns 404 when the collection is empty
        this.trips = [];
        this.message = error.status === 404
          ? 'There were no trips retrieved from the database.'
          : 'Error: unable to reach the API server.';
        console.log('Error: ' + error.message);
      }
    });
  }
}
