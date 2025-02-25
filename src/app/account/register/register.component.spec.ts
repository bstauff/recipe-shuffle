import { TestBed, fakeAsync, waitForAsync } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideRouter } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let harness: RouterTestingHarness;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        BrowserAnimationsModule,
        RegisterComponent,
        ReactiveFormsModule,
      ],
      providers: [
        provideRouter([
          {
            path: 'account/login',
            component: LoginComponent,
          },
          {
            path: '**',
            component: RegisterComponent,
          },
        ]),
      ],
    }).compileComponents();

    harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl('/', RegisterComponent);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when empty', fakeAsync(() => {
    expect(component.registerForm.valid).toBeFalse();
  }));

  it('should have invalid email when empty', fakeAsync(() => {
    const emailControl = component.registerForm.get('email');
    emailControl?.markAsTouched();
    emailControl?.markAsDirty();

    expect(emailControl?.valid).toBeFalse();
    expect(emailControl?.hasError('required')).toBeTrue();
  }));

  it('should have invalid email with bad format', fakeAsync(() => {
    const emailControl = component.registerForm.get('email');
    emailControl?.setValue('not an email');
    emailControl?.markAsTouched();
    emailControl?.markAsDirty();

    expect(emailControl?.valid).toBeFalse();
    expect(emailControl?.hasError('email')).toBeTrue();
  }));

  it('should have valid email with good format', fakeAsync(() => {
    const emailControl = component.registerForm.get('email');
    emailControl?.setValue('good@email.com');
    emailControl?.markAsTouched();
    emailControl?.markAsDirty();

    expect(emailControl?.valid).toBeTrue();
  }));

  it('should have invalid form when passwords do not match', fakeAsync(() => {
    const passwordControl = component.registerForm.get('confirmPassword.password');
    const confirmPasswordControl = component.registerForm.get(
      'confirmPassword.confirmPassword'
    );

    passwordControl?.setValue('asdf');
    passwordControl?.markAsTouched();
    passwordControl?.markAsDirty();
    confirmPasswordControl?.setValue('qwer');
    confirmPasswordControl?.markAsTouched();
    confirmPasswordControl?.markAsDirty();

    expect(component.registerForm.get('confirmPassword')?.valid).toBeFalse();
  }));

  it('should disable submit button when form invalid', fakeAsync(async () => {
    const element = await harness.routeNativeElement;
    const button = element?.querySelector(
      'button[type="submit"]'
    ) as HTMLButtonElement;
    expect(button.disabled).toBeTrue();
  }));
});
