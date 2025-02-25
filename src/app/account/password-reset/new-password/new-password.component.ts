import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { passwordsMatchValidator } from '../../register/register.passwords.validator';
import { PasswordMismatchErrorStateMatcher } from '../../register/register.component';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButton } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';

@Component({
  selector: 'app-password-confirmation',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    NgIf,
    MatError,
    MatButton,
  ],
})
export class NewPasswordComponent implements OnDestroy {
  passMismatchErrorStateMatcher = new PasswordMismatchErrorStateMatcher();
  confirmPasswordForm = this.formBuilder.group(
    {
      password: this.formBuilder.control('', [Validators.required]),
      confirmPassword: this.formBuilder.control('', [Validators.required]),
    },
    { validators: [passwordsMatchValidator] }
  );

  private destroy$ = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onSubmit(): void {}

  hasPasswordMatchError(): boolean | undefined {
    const passwordControl = this.confirmPasswordForm.get('password');
    const confirmPassControl = this.confirmPasswordForm.get('confirmPassword');

    const hasError =
      passwordControl?.dirty &&
      passwordControl.touched &&
      confirmPassControl?.dirty &&
      confirmPassControl.touched &&
      this.confirmPasswordForm.hasError('passwordsDoNotMatch');

    return hasError;
  }

  notifyUserPasswordUpdated(): void {
    this.snackBar.open('Password updated', 'OK');
    this.router.navigate(['/recipes']);
  }
}
