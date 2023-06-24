import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from 'src/app/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { SupabaseService } from 'src/app/shared/supabase.service';
import { of } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let supaServiceSpy: jasmine.SpyObj<SupabaseService>;
  beforeEach(() => {
    supaServiceSpy = jasmine.createSpyObj('SupabaseService', ['signUpUser']);

    supaServiceSpy.signUpUser.and.returnValue(
      of({ isError: false, errorMessage: 'good to go' })
    );

    TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        MatFormFieldModule,
        ReactiveFormsModule,
        MatInputModule,
        MatButtonModule,
        SharedModule,
        BrowserAnimationsModule,
        RouterTestingModule,
      ],
      providers: [{ provide: SupabaseService, useValue: supaServiceSpy }],
    });
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form if email is missing', fakeAsync(() => {
    component.registerForm.get('email')?.setValue('');
    expect(component.registerForm.valid).toBeFalsy();
    const requiredError = component.registerForm
      .get('email')
      ?.getError('required');
    expect(requiredError).toBeTruthy();
  }));

  it('should have an invalid form if email is invalid', fakeAsync(() => {
    component.registerForm.get('email')?.setValue('invalid email');
    expect(component.registerForm.valid).toBeFalsy();
    const emailError = component.registerForm.get('email')?.getError('email');
    expect(emailError).toBeTruthy();
  }));

  it('should have an invalid form if password is missing', fakeAsync(() => {
    component.registerForm.get('confirmPassword.password')?.setValue('');
    expect(component.registerForm.valid).toBeFalsy();
    const requiredError = component.registerForm
      .get('confirmPassword.password')
      ?.getError('required');
    expect(requiredError).toBeTruthy();
  }));

  it('should have an invalid form if the password confirmation is missing', fakeAsync(() => {
    component.registerForm.get('confirmPassword.confirmPassword')?.setValue('');
    expect(component.registerForm.valid).toBeFalsy();
    const requiredError = component.registerForm
      .get('confirmPassword.confirmPassword')
      ?.getError('required');
    expect(requiredError).toBeTruthy();
  }));

  it('should have an invalid form  if the password and confirmation do not match', fakeAsync(() => {
    const emailComponent = component.registerForm.get('email');
    const passwordComponent = component.registerForm.get(
      'confirmPassword.password'
    );
    const confirmPasswordComponent = component.registerForm.get(
      'confirmPassword.confirmPassword'
    );
    emailComponent?.setValue('brian@gmail.com');
    emailComponent?.markAsTouched();
    emailComponent?.markAsDirty();
    passwordComponent?.setValue('asdf');
    passwordComponent?.markAsTouched();
    passwordComponent?.markAsDirty();
    confirmPasswordComponent?.setValue('jkl');
    confirmPasswordComponent?.markAsTouched();
    confirmPasswordComponent?.markAsDirty();

    expect(component.registerForm.valid).toBeFalse();
  }));

  it('should disable register button if form is invalid', fakeAsync(() => {
    const emailComponent = component.registerForm.get('email');
    const passwordComponent = component.registerForm.get(
      'confirmPassword.password'
    );
    const confirmPasswordComponent = component.registerForm.get(
      'confirmPassword.confirmPassword'
    );

    emailComponent?.setValue('brian@gmail.com');
    emailComponent?.markAsTouched();
    emailComponent?.markAsDirty();
    passwordComponent?.setValue('asdf');
    passwordComponent?.markAsTouched();
    passwordComponent?.markAsDirty();
    confirmPasswordComponent?.setValue('jkl');
    confirmPasswordComponent?.markAsTouched();
    confirmPasswordComponent?.markAsDirty();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector(
      'button.register-form__register-button'
    );
    expect(button.disabled).toBeTrue();
  }));

  it('should call SupabaseService when submitted with valid form', fakeAsync(() => {
    const emailComponent = component.registerForm.get('email');
    const passwordComponent = component.registerForm.get(
      'confirmPassword.password'
    );
    const confirmPasswordComponent = component.registerForm.get(
      'confirmPassword.confirmPassword'
    );

    emailComponent?.setValue('brian@gmail.com');
    emailComponent?.markAsTouched();
    emailComponent?.markAsDirty();
    passwordComponent?.setValue('asdf');
    passwordComponent?.markAsTouched();
    passwordComponent?.markAsDirty();
    confirmPasswordComponent?.setValue('asdf');
    confirmPasswordComponent?.markAsTouched();
    confirmPasswordComponent?.markAsDirty();

    component.onSubmit();

    expect(supaServiceSpy.signUpUser).toHaveBeenCalled();
  }));
});
