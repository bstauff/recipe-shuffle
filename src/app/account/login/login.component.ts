import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { NgIf } from '@angular/common';
import { AuthService } from '../../shared/auth.service';
import { switchMap, tap } from 'rxjs/operators';

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
export class LoginComponent implements OnInit {
  loginError = '';
  returnUrl: string = '/recipes';

  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);

  loginForm = this.formBuilder.group({
    email: this.formBuilder.control('', [
      Validators.required,
      Validators.email,
    ]),
    password: this.formBuilder.control('', [Validators.required]),
  });

  ngOnInit(): void {
    // Get return url from route parameters or default to '/recipes'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/recipes';
  }

  onSubmit() {
    const { email, password } = this.loginForm.value;

    if (!email || !password) {
      return;
    }

    this.authService.login(email, password).pipe(
      switchMap(() => this.authService.isEmailVerified$),
      tap(isVerified => {
        if (!isVerified) {
          // If email is not verified, redirect to verification page
          this.router.navigate(['/email-verification']);
        } else {
          // If email is verified, redirect to the return URL
          this.router.navigateByUrl(this.returnUrl);
        }
      })
    ).subscribe({
      error: (error) => {
        this.loginError = error.message || 'Failed to login. Please try again.';
      },
    });
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
