import { Injectable } from "@angular/core";
import {
	AuthError,
	type AuthResponse,
	type AuthTokenResponsePassword,
	createClient,
	type SupabaseClient,
} from "@supabase/supabase-js";
import { BehaviorSubject, from, type Observable, tap } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
	providedIn: "root",
})
export class SupabaseService {
	private supabase: SupabaseClient = createClient(
		environment.supabaseUrl,
		environment.supabaseKey,
	);

	private _user$ = new BehaviorSubject<string | null>(null);
	readonly user$: Observable<string | null> = this._user$.asObservable();

	loadSession() {
		return from(this.supabase.auth.getSession()).pipe(
			tap((session) => {
				if (session.error) {
					console.error(
						`Unable to load session data. ${session.error.message}`,
						session.error,
					);
				} else if (!session.data.session) {
					console.info("Unable to load session data from local storage");
				} else {
					console.log(`got session=${session.data.session.user.id}`);
					this._user$.next(session.data.session.user.id);
				}
			}),
		);
	}

	register(credentials: {
		email: string;
		password: string;
	}): Observable<AuthResponse> {
		return from(this.supabase.auth.signUp(credentials));
	}

	login(credentials: {
		email: string;
		password: string;
	}): Observable<AuthTokenResponsePassword> {
		return from(this.supabase.auth.signInWithPassword(credentials)).pipe(
			tap((signInResponse) => {
				if (!signInResponse.error) {
					this._user$.next(signInResponse.data.user.id);
				}
			}),
		);
	}
	sendPasswordResetEmail(
		email: string,
		redirectTo: string | undefined,
	): Observable<
		| {
				data: object;
				error: null;
		  }
		| {
				data: null;
				error: AuthError;
		  }
	> {
		return from(
			this.supabase.auth.resetPasswordForEmail(email, {
				redirectTo: redirectTo,
			}),
		);
	}
}
