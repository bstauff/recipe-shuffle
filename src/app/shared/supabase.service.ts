import { Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  AuthResponse,
  AuthSession,
  createClient,
  SupabaseClient,
} from '@supabase/supabase-js';
import { from, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;
  _session: AuthSession | null = null;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  register(credentials: {
    email: string;
    password: string;
  }): Observable<AuthResponse | undefined> {
    return from(this.supabase.auth.signUp(credentials));
  }
}
