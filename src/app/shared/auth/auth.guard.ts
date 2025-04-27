import { type CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { AuthService } from "./auth.service";
import { exhaustMap, of, take } from "rxjs";
import type { UserDetails } from "./models/user-details.model";

export const authGuard: CanActivateFn = () => {
	const router = inject(Router);
	const authService = inject(AuthService);

	return authService.user$.pipe(
		take(1),
		exhaustMap((user: UserDetails | null) => {
			console.log(`got user=${user}`);
			if (!user) {
				return router.navigate(["/account/login"]);
			}
			return of(true);
		}),
	);
};
