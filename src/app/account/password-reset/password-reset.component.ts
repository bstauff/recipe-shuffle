import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { SupabaseService } from 'src/app/shared/supabase.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
})
export class PasswordResetComponent implements OnDestroy {
  resetEmailCollection: FormGroup = this.formBuilder.group({
    email: this.formBuilder.control('', [Validators.required]),
  });

  private destroy$ = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private supabaseService: SupabaseService,
    private snackBar: MatSnackBar
  ) {}
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onSubmit(): void {
    const email = this.resetEmailCollection.value?.email;

    if (email) {
      this.supabaseService
        .initiatePasswordReset(email)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          error: (error) => console.error(error),
          complete: () => this.notifyUserEmailSent(),
        });
    }
  }
  private notifyUserEmailSent(): void {
    this.snackBar.open('Password reset email sent');
    this.resetEmailCollection.reset();
  }
}
