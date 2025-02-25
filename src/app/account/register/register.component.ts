import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroupDirective, NgForm, Validators, ReactiveFormsModule } from '@angular/forms';
import { SupabaseService } from 'src/app/shared/supabase.service';
import { passwordsMatchValidator } from './register.passwords.validator';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatButton } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    imports: [
        ReactiveFormsModule,
        MatFormField,
        MatLabel,
        MatInput,
        NgIf,
        MatError,
        MatButton,
    ]
})
export class RegisterComponent {
  passwordMismatchErrorStateMatcher = new PasswordMismatchErrorStateMatcher();
  registerForm = this.formBuilder.group({
    email: this.formBuilder.control('', [
      Validators.required,
      Validators.email,
    ]),
    confirmPassword: this.formBuilder.group(
      {
        password: this.formBuilder.control('', [Validators.required]),
        confirmPassword: this.formBuilder.control('', [Validators.required]),
      },
      { validators: [passwordsMatchValidator] }
    ),
  });

  constructor(
    private formBuilder: FormBuilder,
    private supabaseService: SupabaseService
  ) {}

  onSubmit() {
    const email = this.registerForm.get('email')?.value;

    const password = this.registerForm.get('confirmPassword.password')?.value;

    const confirmPassword = this.registerForm.get(
      'confirmPassword.confirmPassword'
    )?.value;

    if (!email || !password) return;

    if (password !== confirmPassword) return;

    this.supabaseService.signUpUser(email, password).subscribe({
      error: (error) => console.error('sign up failed', error),
    });
    this.registerForm.reset();
  }
  hasPasswordMatchError(): boolean | undefined {
    return (
      this.registerForm
        .get('confirmPassword')
        ?.hasError('passwordsDoNotMatch') &&
      this.registerForm.get('confirmPassword')?.dirty &&
      this.registerForm.get('confirmPassword')?.touched
    );
  }
}

export class PasswordMismatchErrorStateMatcher extends ErrorStateMatcher {
  override isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    if (control?.dirty && control.touched && control.invalid) {
      return true;
    } else if (
      control?.parent?.dirty &&
      control.parent.touched &&
      control.parent.invalid
    ) {
      return true;
    }

    return false;
  }
}
