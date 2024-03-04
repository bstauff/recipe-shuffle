import { TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingHarness } from '@angular/router/testing';
import { SupabaseService } from 'src/app/shared/supabase.service';
import { of } from 'rxjs';
import { Router, provideRouter } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';

describe('LoginComponent', () => {
  const supabaseService = jasmine.createSpyObj('SupabaseService', [
    'loginUser',
  ]);

  let component: LoginComponent;
  let harness: RouterTestingHarness;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MatFormFieldModule,
        ReactiveFormsModule,
        MatInputModule,
        MatButtonModule,
        BrowserAnimationsModule,
        LoginComponent,
      ],
    });

    supabaseService.loginUser.and.returnValue(
      of({
        isError: false,
        errorMessage: '',
      })
    );
  });
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: SupabaseService,
          useValue: supabaseService,
        },
        provideRouter([
          {
            path: '**',
            component: LoginComponent,
          },
        ]),
      ],
    })
      .compileComponents()
      .then(async () => {
        harness = await RouterTestingHarness.create();
        component = await harness.navigateByUrl(
          '/account/login',
          LoginComponent
        );
      });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should require an email', () => {
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('');
    emailControl?.markAsTouched();
    expect(component.emailHasError()).toBe(true);
    expect(emailControl?.hasError('required')).toBe(true);
  });

  it('should require a password', () => {
    const passwordControl = component.loginForm.get('password');
    passwordControl?.setValue('');
    passwordControl?.markAsTouched();
    expect(component.passwordHasError()).toBe(true);
    expect(passwordControl?.hasError('required')).toBe(true);
  });

  it('should call login on supabase service when submitted', fakeAsync(() => {
    const expectedEmail = 'asdf@acme.com';
    const expectedPassword = 'password';

    component.loginForm.get('email')?.setValue(expectedEmail);
    component.loginForm.get('password')?.setValue(expectedPassword);

    component.onSubmit();

    harness.detectChanges();
    tick();

    expect(supabaseService.loginUser).toHaveBeenCalledWith(
      expectedEmail,
      expectedPassword
    );

    const router = TestBed.inject(Router);
    expect(router.url).toBe('/recipes');
  }));
});
