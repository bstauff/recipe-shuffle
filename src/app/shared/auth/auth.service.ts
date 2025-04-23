import { type AuthResponse } from "@supabase/supabase-js";
import { SupabaseService } from "../supabase.service";
import { inject, Injectable } from "@angular/core";
import { catchError, map, type Observable, throwError } from "rxjs";
import { type UserDetails } from "./models/user-details.model";
import { type Registration } from "./models/registration.model";
import { DOCUMENT } from "@angular/common";

@Injectable({ providedIn: "root" })
export class AuthService {
	private readonly supabaseService = inject(SupabaseService);
	private readonly document = inject(DOCUMENT);
	readonly user$: Observable<string | null> = this.supabaseService.user$;

	login(email: string, password: string): Observable<string> {
		return this.supabaseService.login({ email, password }).pipe(
			map((authResponse) => {
				if (authResponse.error) {
					throw authResponse.error;
				}
				return authResponse.data.user.id;
			}),
		);
	}

	register(registration: Registration): Observable<UserDetails | undefined> {
		return this.supabaseService.register(registration).pipe(
			map((response: AuthResponse) => {
				if (response.error) throw response.error;
				if (!response.data.user) throw new Error("User not found");

				return {
					id: response.data.user?.id,
					email: response.data.user?.email,
					confirmed_at: response.data.user?.confirmed_at,
				};
			}),
			catchError((error) => {
				console.error("Error during registration:", error);
				return throwError(() => new Error("Registration failed"));
			}),
		);
	}
	sendPasswordResetEmail(email: string) {
		const host = this.document.defaultView?.location?.host;
		const protocol = this.document.defaultView?.location?.protocol;
		let redirectUrl: string | undefined;
		if (host && protocol) {
			redirectUrl = `${protocol}//${host}/account/password-reset/new-password`;
		}
		return this.supabaseService.sendPasswordResetEmail(email, redirectUrl).pipe(
			map((response) => {
				if (response.error) {
					throw response.error;
				}
				return;
			}),
		);
	}
}
