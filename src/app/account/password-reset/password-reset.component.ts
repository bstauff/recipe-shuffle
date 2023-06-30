import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
})
export class PasswordResetComponent {
  resetEmailCollection: FormGroup = this.formBuilder.group({
    email: this.formBuilder.control('', [Validators.required]),
  });

  constructor(private formBuilder: FormBuilder) {}

  onSubmit(): void {
    console.log(
      'you will reset email for: ',
      this.resetEmailCollection.get('email')?.value
    );
  }
}
