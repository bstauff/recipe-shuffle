import { type CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { AuthService } from "./auth.service";
import { exhaustMap, of, take } from "rxjs";

export const authGuard: CanActivateFn = () => {
	const router = inject(Router);
	const authService = inject(AuthService);

	return authService.user$.pipe(
		take(1),
		exhaustMap((userId: string | null) => {
			console.log(`authGuard -- loggedInUserId=${userId}`);
			if (!userId) {
				return router.navigate(["/account/login"]);
			}
			return of(true);
		}),
	);
};
