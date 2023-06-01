import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SupabaseService } from 'src/app/shared/supabase.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm = this.formBuilder.group({
    email: this.formBuilder.control(''),
    password: this.formBuilder.control(''),
    confirmPassword: this.formBuilder.control(''),
  });

  constructor(
    private formBuilder: FormBuilder,
    private supabaseService: SupabaseService
  ) {}

  onSubmit() {
    console.log(this.registerForm.value);
    const { email, password } = this.registerForm.value;
    if (!email || !password) return;
    this.supabaseService.signUpUser(email, password).subscribe(
      {
        next: (response) => {
          console.log(response);
        }
      }
    );
  }
}
