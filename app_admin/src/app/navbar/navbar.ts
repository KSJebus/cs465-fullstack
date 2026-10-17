import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { Authentication } from '../services/authentication';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  private authentication = inject(Authentication);
  private router = inject(Router);

  isLoggedIn(): boolean {
    return this.authentication.isLoggedIn();
  }

  userName(): string {
    return this.authentication.getCurrentUser()?.name ?? '';
  }

  onLogout(): void {
    this.authentication.logout();
    this.router.navigate(['']);
  }
}
