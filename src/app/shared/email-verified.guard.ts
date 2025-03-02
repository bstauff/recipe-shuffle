import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { map, first } from 'rxjs/operators';

export const emailVerifiedGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.isEmailVerified$.pipe(
    first(),
    map((isVerified) => {
      if (isVerified) {
        return true;
      } else {
        // Redirect to email verification page
        router.navigate(['/email-verification']);
        return false;
      }
    })
  );
};
