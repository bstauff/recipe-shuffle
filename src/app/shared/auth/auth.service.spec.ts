import { AuthError, AuthResponse } from '@supabase/supabase-js';
import { SupabaseService } from '../supabase.service';
import { AuthService } from './auth.service';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

describe('AuthService', () => {
  let authService: AuthService;
  let supabaseServiceSpy: jasmine.SpyObj<SupabaseService>;

  beforeEach(() => {
    supabaseServiceSpy = jasmine.createSpyObj('SupabaseService', ['register']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: SupabaseService, useValue: supabaseServiceSpy },
      ],
    });

    authService = TestBed.inject(AuthService);
  });

  describe('register', () => {
    it('should throw an error if SupabaseService returns an error', () => {
      const expectedError = new AuthError(
        'Password is too weak!',
        400,
        'weak_password'
      );
      const errorResponse: AuthResponse = {
        data: { user: null, session: null },
        error: expectedError,
      };

      const errorObservable = of(errorResponse);

      supabaseServiceSpy.register.and.returnValue(errorObservable);

      authService
        .register({ email: 'fake.email@gmail.com', password: 'asdf' })
        .subscribe({
          error: (err) => {
            expect(err.message).toEqual('Registration failed');
          },
        });
    });
  });
  it('should throw an error if SupabaseService returns null for user', () => {
    const errorResponse: AuthResponse = {
      data: {
        user: null,
        session: {
          access_token: '',
          refresh_token: '',
          expires_in: 0,
          token_type: '',
          user: {
            id: '',
            aud: '',
            role: '',
            email: '',
            phone: '',
            confirmed_at: '',
            last_sign_in_at: '',
            app_metadata: {
              provider: '',
              providers: [],
            },
            user_metadata: {},
            created_at: '',
          },
        },
      },
      error: null,
    };

    const errorObservable = of(errorResponse);

    supabaseServiceSpy.register.and.returnValue(errorObservable);

    authService
      .register({ email: 'fake.email@gmail.com', password: 'asdf' })
      .subscribe({
        error: (err) => {
          expect(err.message).toEqual('Registration failed');
        },
      });
  });

  it('should throw an error if SupabaseService returns null for session', () => {
    const errorResponse: AuthResponse = {
      data: {
        user: {
          id: '',
          aud: '',
          role: '',
          email: '',
          phone: '',
          confirmed_at: '',
          last_sign_in_at: '',
          app_metadata: {
            provider: '',
            providers: [],
          },
          user_metadata: {},
          created_at: '',
        },
        session: null,
      },
      error: null,
    };

    const errorObservable = of(errorResponse);

    supabaseServiceSpy.register.and.returnValue(errorObservable);

    authService
      .register({ email: 'fake.email@gmail.com', password: 'asdf' })
      .subscribe({
        error: (err) => {
          expect(err.message).toEqual('Registration failed');
        },
      });
  });

  it('should return id, email, confirmed from supabase', () => {
    const expectedUserResponse = {
      id: 'beaf6faa-3181-46e6-b008-184239b81c96',
      aud: '',
      role: '',
      email: 'fake.email@gmail.com',
      phone: '',
      confirmed_at: '2025-03-22T12:26:27+0000',
      last_sign_in_at: '',
      app_metadata: {
        provider: '',
        providers: [],
      },
      user_metadata: {},
      created_at: '',
    };
    const goodResponse: AuthResponse = {
      data: {
        user: expectedUserResponse,
        session: {
          access_token: '',
          refresh_token: '',
          expires_in: 0,
          token_type: '',
          user: {
            id: '',
            aud: '',
            role: '',
            email: '',
            phone: '',
            confirmed_at: '',
            last_sign_in_at: '',
            app_metadata: {
              provider: '',
              providers: [],
            },
            user_metadata: {},
            created_at: '',
          },
        },
      },
      error: null,
    };

    const successObservable = of(goodResponse);

    supabaseServiceSpy.register.and.returnValue(successObservable);

    authService
      .register({ email: 'fake.email@gmail.com', password: 'asdf' })
      .subscribe({
        next: (response) => {
          expect(response?.id).toEqual(expectedUserResponse.id);
          expect(response?.email).toEqual(expectedUserResponse.email);
          expect(response?.confirmed_at).toEqual(
            expectedUserResponse.confirmed_at
          );
        },
      });
  });
});
