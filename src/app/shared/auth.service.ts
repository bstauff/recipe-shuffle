import { AuthResponse } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _isLoggedIn = signal<boolean>(false);
  readonly isLoggedIn = this._isLoggedIn.asReadonly();

  constructor(private supabase: SupabaseService) {}

  register(
    email: string,
    password: string
  ): Observable<AuthResponse | undefined> {
    return this.supabase.register({ email: email, password: password });
  }
}
