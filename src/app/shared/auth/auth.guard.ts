import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { exhaustMap, from, of, tap } from 'rxjs';


export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.isLoggedIn$.pipe(
    exhaustMap((isLoggedIn: boolean) => {
      if (!isLoggedIn) {
        return router.navigate(['/account/login']);
      } else {
        return of(true)
      }
    })
  );
};
