import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

import { Authentication } from './services/authentication';

// Send anyone who is not logged in to the login page before add/edit screens
export const authGuard: CanActivateFn = () => {
  const authentication = inject(Authentication);
  return authentication.isLoggedIn() || inject(Router).createUrlTree(['/login']);
};
