import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupabaseService } from 'src/app/shared/supabase.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
})
export class PasswordResetComponent {
  resetEmailCollection: FormGroup = this.formBuilder.group({
    email: this.formBuilder.control('', [Validators.required]),
  });

  constructor(
    private formBuilder: FormBuilder,
    private supabaseService: SupabaseService
  ) {}

  onSubmit(): void {
    const email = this.resetEmailCollection.value?.email;

    if (email) {
      this.supabaseService.initiatePasswordReset(email);
    }
  }
}
