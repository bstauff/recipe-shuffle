import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { Observable, exhaustMap, from, of, tap } from 'rxjs';
import { AuthResponse } from './models/AuthResponse';
import { Recipe } from '../recipe/models/recipe';
import { Database } from './models/Database';
import { ulid } from 'ulid';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabaseClient = createClient<Database>(
    'https://mktkekolltbsdrhufdtk.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rdGtla29sbHRic2RyaHVmZHRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODUzNzExMjMsImV4cCI6MjAwMDk0NzEyM30.5exOJ4rN_dfEeMwHK5yfmEJ_TFKTxHHq1xgd8KAdVgY'
  );

  signUpUser(email: string, password: string): Observable<AuthResponse> {
    return from(this.supabaseClient.auth.signUp({ email, password })).pipe(
      exhaustMap((signupResponse) => {
        if (signupResponse.error) {
          return of({
            isError: true,
            errorMessage: signupResponse.error.message,
          });
        }
        return of({ isError: false, errorMessage: '' });
      })
    );
  }
  loginUser(email: string, password: string): Observable<AuthResponse> {
    return from(
      this.supabaseClient.auth.signInWithPassword({ email, password })
    ).pipe(
      exhaustMap((loginResponse) => {
        if (loginResponse.error) {
          return of({
            isError: true,
            errorMessage: loginResponse.error.message,
          });
        }
        return of({ isError: false, errorMessage: '' });
      })
    );
  }
  isUserLoggedIn(): Observable<boolean> {
    return from(this.supabaseClient.auth.getSession()).pipe(
      exhaustMap((session) => {
        if (session.data.session) {
          return of(true);
        }
        return of(false);
      })
    );
  }
  insertRecipe(
    recipe: Recipe
  ): Observable<{ error: string; isError: boolean }> {
    return from(
      this.supabaseClient.from('recipe').insert({
        key: '01888684-79E9-D1F8-3ED7-67CC890FB42F',
        name: recipe.name,
        url: recipe.url,
      })
    ).pipe(
      tap((insertResponse) => {
        console.log('insertResponse', insertResponse);
      }),
      exhaustMap((insertResponse) => {
        if (insertResponse.error) {
          return of({ error: insertResponse.error.message, isError: true });
        }
        return of({ error: '', isError: false });
      })
    );
  }
}
