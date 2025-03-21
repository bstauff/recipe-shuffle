import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserStatusComponent } from './shared/user-status/user-status.component';
import { AuthService } from './shared/auth.service';
import { of } from 'rxjs';
import { Auth } from '@angular/fire/auth';

// Mock Auth service
const mockAuth = {
  currentUser: null,
  onAuthStateChanged: jasmine.createSpy('onAuthStateChanged'),
  signInWithEmailAndPassword: jasmine.createSpy('signInWithEmailAndPassword'),
  createUserWithEmailAndPassword: jasmine.createSpy('createUserWithEmailAndPassword'),
  signOut: jasmine.createSpy('signOut'),
};

// Mock AuthService
const mockAuthService = {
  currentUser$: of(null),
  isLoggedIn$: of(false),
  isEmailVerified$: of(false),
  login: jasmine.createSpy('login').and.returnValue(of({})),
  register: jasmine.createSpy('register').and.returnValue(of({})),
  logout: jasmine.createSpy('logout').and.returnValue(of(undefined)),
  getCurrentUser: jasmine.createSpy('getCurrentUser').and.returnValue(of(null)),
  sendVerificationEmail: jasmine.createSpy('sendVerificationEmail').and.returnValue(of(undefined)),
  isCurrentUserEmailVerified: jasmine.createSpy('isCurrentUserEmailVerified').and.returnValue(false),
  verifyEmail: jasmine.createSpy('verifyEmail').and.returnValue(of(undefined)),
  sendPasswordResetEmail: jasmine.createSpy('sendPasswordResetEmail').and.returnValue(of(undefined)),
};

describe('AppComponent', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule,
        MatSlideToggleModule,
        MatSidenavModule,
        MatToolbarModule,
        MatListModule,
        MatIconModule,
        MatButtonModule,
        MatTabsModule,
        MatDividerModule,
        AppComponent,
        UserStatusComponent,
      ],
      providers: [
        { provide: Auth, useValue: mockAuth },
        { provide: AuthService, useValue: mockAuthService },
      ],
    })
  );

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'recipe-shuffle'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('recipe-shuffle');
  });
});
