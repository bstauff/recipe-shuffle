import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/shared/supabase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
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
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  onSubmit() {
    const { email, password } = this.loginForm.value;

    if (!email || !password) {
      return;
    }
    this.supabaseService.loginUser(email, password).subscribe({
      next: (response) => {
        if (response.isError) {
          this.loginError = response.errorMessage;
          this.loginForm.reset();
        } else {
          this.router.navigate(['/recipes']);
        }
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
