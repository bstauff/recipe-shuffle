import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { 
  Auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  authState,
  UserCredential,
  User,
  sendEmailVerification,
  applyActionCode,
  sendPasswordResetEmail
} from '@angular/fire/auth';
import { Observable, from, throwError } from 'rxjs';
import { map, tap, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private router: Router = inject(Router);
  
  // Observable of the current auth state
  currentUser$ = authState(this.auth);
  
  // Check if user is logged in
  isLoggedIn$ = this.currentUser$.pipe(
    map(user => !!user)
  );

  // Check if user's email is verified
  isEmailVerified$ = this.currentUser$.pipe(
    map(user => !!user?.emailVerified)
  );

  constructor() {}

  // Login with email and password
  login(email: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  // Register a new user and send verification email
  register(email: string, password: string): Observable<UserCredential> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap(credentials => {
        // Send verification email after successful registration
        return this.sendVerificationEmail(credentials.user).pipe(
          map(() => credentials)
        );
      })
    );
  }

  // Send email verification to the current user
  sendVerificationEmail(user: User = this.auth.currentUser!): Observable<void> {
    if (!user) {
      return throwError(() => new Error('No user is currently signed in'));
    }
    return from(sendEmailVerification(user));
  }

  // Check if current user's email is verified
  isCurrentUserEmailVerified(): boolean {
    return this.auth.currentUser?.emailVerified || false;
  }

  // Verify email with action code (from verification email link)
  verifyEmail(actionCode: string): Observable<void> {
    return from(applyActionCode(this.auth, actionCode));
  }

  // Send password reset email
  sendPasswordResetEmail(email: string): Observable<void> {
    return from(sendPasswordResetEmail(this.auth, email));
  }

  // Logout the current user
  logout(): Observable<void> {
    return from(signOut(this.auth)).pipe(
      tap(() => {
        this.router.navigate(['/account/login']);
      })
    );
  }

  // Get the current user
  getCurrentUser(): Observable<User | null> {
    return this.currentUser$;
  }
}
