import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    NgIf,
    MatError,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton,
    RouterLink,
  ],
})
export class LoginComponent {
  loginForm = this.formBuilder.group({
    email: this.formBuilder.control('', [
      Validators.required,
      Validators.email,
    ]),
    password: this.formBuilder.control('', [Validators.required]),
  });

  loginError = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  onSubmit() {
    const { email, password } = this.loginForm.value;

    if (!email || !password) {
      return;
    }
  }

  emailHasError(): boolean | undefined {
    const emailControl = this.loginForm.get('email');
    return emailControl?.invalid && emailControl?.touched;
  }
  getEmailErrorMessage(): string {
    const emailControl = this.loginForm.get('email');
    if (emailControl?.hasError('required')) {
      return 'You must enter a value';
    }
    return emailControl?.hasError('email') ? 'Not a valid email' : '';
  }
  passwordHasError(): boolean | undefined {
    const passwordControl = this.loginForm.get('password');
    return passwordControl?.invalid && passwordControl?.touched;
  }
  getPasswordErrorMessage(): string {
    const passwordControl = this.loginForm.get('password');
    if (passwordControl?.hasError('required')) {
      return 'You must enter a value';
    }
    return '';
  }
}
