import { InjectionToken } from '@angular/core';

// Injectable handle on the browser's localStorage, used to persist the JWT
export const BROWSER_STORAGE = new InjectionToken<Storage>('Browser Storage', {
  providedIn: 'root',
  factory: () => localStorage
});
