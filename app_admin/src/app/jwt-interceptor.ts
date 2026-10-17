import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { Authentication } from './services/authentication';

// Attach "Authorization: Bearer <token>" to API calls once logged in.
// Login and register requests are left alone since they issue the token.
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authentication = inject(Authentication);
  const isAuthApiCall = req.url.endsWith('/login') || req.url.endsWith('/register');

  if (authentication.isLoggedIn() && !isAuthApiCall) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authentication.getToken()}`
      }
    });
  }
  return next(req);
};
