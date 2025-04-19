import { Injectable } from "@angular/core";
import {
	AuthResponse,
	AuthTokenResponsePassword,
	createClient,
	SupabaseClient,
} from "@supabase/supabase-js";
import {
	BehaviorSubject,
	combineLatest,
	from,
	map,
	merge,
	Observable,
	tap,
} from "rxjs";
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

	constructor() {}

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
}
