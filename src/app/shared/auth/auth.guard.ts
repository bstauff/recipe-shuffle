import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  // const router = inject(Router);
  // const authService = inject(AuthService);

  return false;
};
