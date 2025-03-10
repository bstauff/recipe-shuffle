import { Component, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { MatButton } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
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
export class PasswordResetComponent implements OnDestroy {
  resetEmailCollection: FormGroup = this.formBuilder.group({
    email: this.formBuilder.control('', [Validators.required]),
  });

  private destroy$ = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {}
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onSubmit(): void {}
  private notifyUserEmailSent(): void {
    this.snackBar.open('Password reset email sent');
    this.resetEmailCollection.reset();
  }
}
