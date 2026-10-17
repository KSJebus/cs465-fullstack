import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Authentication } from '../services/authentication';
import { User } from '../models/user';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private router = inject(Router);
  private authentication = inject(Authentication);

  formError = '';
  submitted = false;

  credentials = {
    name: '',
    email: '',
    password: ''
  };

  onLoginSubmit(): void {
    this.formError = '';
    if (!this.credentials.email || !this.credentials.password) {
      this.formError = 'All fields are required, please try again';
      return;
    }
    this.doLogin();
  }

  private doLogin(): void {
    const user: User = {
      name: this.credentials.name,
      email: this.credentials.email
    };

    this.submitted = true;
    this.authentication.login(user, this.credentials.password).subscribe({
      next: () => this.router.navigate(['']),
      error: (error: any) => {
        this.submitted = false;
        this.formError = error.status === 401
          ? 'Invalid email or password'
          : error.error?.message || 'Unable to reach the API server';
      }
    });
  }
}
