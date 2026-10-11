import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { TripData } from '../services/trip-data';
import { Trip } from '../models/trip';

@Component({
  selector: 'app-edit-trip',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './edit-trip.html',
  styleUrl: './edit-trip.css'
})
export class EditTrip implements OnInit {
  private formBuilder = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tripData = inject(TripData);

  tripCode = '';
  submitted = false;
  message = '';
  error = '';

  editForm = this.formBuilder.nonNullable.group({
    _id: [''],
    code: [{ value: '', disabled: true }], // code identifies the trip; not editable
    name: ['', Validators.required],
    length: ['', Validators.required],
    start: ['', Validators.required],
    resort: ['', Validators.required],
    perPerson: ['', Validators.required],
    image: ['', Validators.required],
    description: ['', Validators.required]
  });

  // Convenience getter for easy access to form fields in the template
  get f() {
    return this.editForm.controls;
  }

  ngOnInit(): void {
    this.tripCode = this.route.snapshot.paramMap.get('tripCode') ?? '';
    if (!this.tripCode) {
      this.router.navigate(['']);
      return;
    }

    this.message = 'Loading trip';
    this.tripData.getTrip(this.tripCode).subscribe({
      next: (value: Trip[]) => {
        const trip = value[0];
        this.editForm.patchValue({
          ...trip,
          _id: trip._id ?? '',
          // <input type="date"> needs yyyy-MM-dd
          start: new Date(trip.start).toISOString().substring(0, 10)
        });
        this.message = `Trip ${this.tripCode} retrieved`;
      },
      error: (error: any) => {
        this.error = error.error?.message || error.message;
        this.message = '';
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';
    if (this.editForm.invalid) {
      return;
    }
    // getRawValue() includes the disabled code control
    this.tripData.updateTrip(this.tripCode, this.editForm.getRawValue() as Trip).subscribe({
      next: () => this.router.navigate(['']),
      error: (error: any) => {
        this.error = error.error?.error || error.message;
        console.log('Error: ' + this.error);
      }
    });
  }
}
