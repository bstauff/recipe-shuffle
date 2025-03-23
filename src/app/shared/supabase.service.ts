import { Injectable } from '@angular/core';
import {
  AuthResponse,
  createClient,
  SupabaseClient,
} from '@supabase/supabase-js';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  private _user$ = new BehaviorSubject(null);
  readonly user$ = this._user$.asObservable();

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  register(credentials: {
    email: string;
    password: string;
  }): Observable<AuthResponse> {
    return from(this.supabase.auth.signUp(credentials));
  }
}
