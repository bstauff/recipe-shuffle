import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { passwordsMatchValidator } from '../../register/register.passwords.validator';
import { PasswordMismatchErrorStateMatcher } from '../../register/register.component';

@Component({
  selector: 'app-password-confirmation',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss'],
})
export class NewPasswordComponent {
  passMismatchErrorStateMatcher = new PasswordMismatchErrorStateMatcher();
  confirmPasswordForm = this.formBuilder.group(
    {
      password: this.formBuilder.control('', [Validators.required]),
      confirmPassword: this.formBuilder.control('', [Validators.required]),
    },
    { validators: [passwordsMatchValidator] }
  );

  constructor(private formBuilder: FormBuilder) {}

  onSubmit(): void {
    console.log('you will submit: ', this.confirmPasswordForm);
  }

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
}
