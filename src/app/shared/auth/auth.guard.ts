import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { AuthService } from "./auth.service";
import { exhaustMap, of } from "rxjs";

export const authGuard: CanActivateFn = () => {
	const router = inject(Router);
	const authService = inject(AuthService);

	return authService.user$.pipe(
		exhaustMap((userId: string | null) => {
			console.log(`authGuard -- loggedInUserId=${userId}`);
			if (!userId) {
				return router.navigate(["/account/login"]);
			} else {
				return of(true);
			}
		}),
	);
};
