import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from '../shared/supabase.service';
import { inject } from '@angular/core';
import { exhaustMap, of } from 'rxjs';

export const LoginGuard: CanActivateFn = (_route, _state) => {
  const supabaseService = inject(SupabaseService);
  const router = inject(Router);

  const isUserLoggedIn$ = supabaseService.isUserLoggedIn();
  return isUserLoggedIn$.pipe(
    exhaustMap((isUserLoggedIn: boolean) => {
      if (isUserLoggedIn) {
        console.log('User is logged in');
        return of(true);
      } else {
        console.log('User is not logged in');
        const loginUrl = router.parseUrl('/account/login');
        return of(loginUrl);
      }
    })
  );
};
