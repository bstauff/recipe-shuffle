import { AuthResponse } from "@supabase/supabase-js";
import { SupabaseService } from "../supabase.service";
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, catchError, map, Observable, throwError } from "rxjs";
import { UserDetails } from "./models/user-details.model";
import { Registration } from "./models/registration.model";

@Injectable({ providedIn: "root" })
export class AuthService {
	private readonly _isLoggedIn$ = new BehaviorSubject(false);
	readonly isLoggedIn$ = this._isLoggedIn$.asObservable();

	private readonly _user$ = new BehaviorSubject(null);
	readonly user$ = this._user$.asObservable();
	private readonly supabaseService = inject(SupabaseService);

	wtf() {}

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
}
