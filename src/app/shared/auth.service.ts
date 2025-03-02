import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { 
  Auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  authState,
  UserCredential,
  User
} from '@angular/fire/auth';
import { Observable, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';

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

  constructor() {}

  // Login with email and password
  login(email: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  // Register a new user
  register(email: string, password: string): Observable<UserCredential> {
    return from(createUserWithEmailAndPassword(this.auth, email, password));
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
