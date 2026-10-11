import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { TripData } from '../services/trip-data';
import { Trip } from '../models/trip';

@Component({
  selector: 'app-add-trip',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './add-trip.html',
  styleUrl: './add-trip.css'
})
export class AddTrip {
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private tripData = inject(TripData);

  submitted = false;
  error = '';

  addForm = this.formBuilder.nonNullable.group({
    code: ['', Validators.required],
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
    return this.addForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';
    if (this.addForm.invalid) {
      return;
    }
    this.tripData.addTrip(this.addForm.getRawValue() as Trip).subscribe({
      next: () => this.router.navigate(['']),
      error: (error: any) => {
        this.error = error.error?.error || error.message;
        console.log('Error: ' + this.error);
      }
    });
  }
}
