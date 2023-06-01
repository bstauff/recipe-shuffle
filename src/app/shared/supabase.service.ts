import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { Observable, exhaustMap, from, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabaseClient = createClient(
    'https://mktkekolltbsdrhufdtk.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rdGtla29sbHRic2RyaHVmZHRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODUzNzExMjMsImV4cCI6MjAwMDk0NzEyM30.5exOJ4rN_dfEeMwHK5yfmEJ_TFKTxHHq1xgd8KAdVgY'
  );

  signUpUser(email: string, password: string): Observable<{isError: boolean, errorMessage: string}> {
    return from(this.supabaseClient.auth.signUp({ email, password })).pipe(
      exhaustMap((signupResponse) => {
        if (signupResponse.error) {
          return of({ isError: true, errorMessage: signupResponse.error.message });
        }
        return of({ isError: false, errorMessage: '' });
      })
    )
  }
}
