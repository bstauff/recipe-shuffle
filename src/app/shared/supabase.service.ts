import { Injectable } from "@angular/core";
import {
	AuthError,
	type AuthResponse,
	type AuthTokenResponsePassword,
	createClient,
	type SupabaseClient,
} from "@supabase/supabase-js";
import {
	BehaviorSubject,
	from,
	map,
	type Observable,
	tap,
	throwError,
} from "rxjs";
import { environment } from "src/environments/environment";
import type { SupabaseUser } from "./models/supabase-user";

@Injectable({
	providedIn: "root",
})
export class SupabaseService {
	private supabase: SupabaseClient = createClient(
		environment.supabaseUrl,
		environment.supabaseKey,
	);

	private _user$ = new BehaviorSubject<SupabaseUser | null>(null);
	readonly user$: Observable<SupabaseUser | null> = this._user$.asObservable();

	loadSession() {
		return from(this.supabase.auth.getSession()).pipe(
			tap((session) => {
				if (session.error) {
					console.error(
						`Unable to load session data. ${session.error.message}`,
						session.error,
					);
				} else if (!session.data.session) {
					console.error("Unable to load session data from local storage");
				} else {
					const user = {
						id: session.data.session.user.id,
						email: session.data.session.user.email,
						confirmedAt: session.data.session.user.confirmed_at,
					};
					this._user$.next(user);
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
					const user = {
						id: signInResponse.data.session.user.id,
						email: signInResponse.data.session.user.email,
						confirmedAt: signInResponse.data.session.user.confirmed_at,
					};
					this._user$.next(user);
				}
			}),
		);
	}
	logout(): Observable<void> {
		const signOutObservable = from(this.supabase.auth.signOut());
		return signOutObservable.pipe(
			tap((response) => {
				console.log("supabase logout response");
				console.log(response);
			}),
			map((response: { error: AuthError | null }) => {
				if (response.error) {
					throw response.error;
				}
				return;
			}),
		);
	}
}
