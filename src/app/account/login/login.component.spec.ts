import { TestBed, waitForAsync } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideRouter } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let harness: RouterTestingHarness;

  beforeEach(waitForAsync(() => {
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
  }));
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
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
});
