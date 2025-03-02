import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../shared/auth.service';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="verify-email-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Email Verification</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div *ngIf="loading" class="loading-spinner">
            <mat-spinner diameter="40"></mat-spinner>
            <p>Verifying your email...</p>
          </div>
          
          <div *ngIf="!loading">
            <div *ngIf="success" class="success-message">
              <p>Your email has been verified successfully!</p>
              <p>You can now use all features of the application.</p>
            </div>
            
            <div *ngIf="error" class="error-message">
              <p>{{ errorMessage }}</p>
              <p>The verification link may have expired or already been used.</p>
            </div>
          </div>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="primary" (click)="goToLogin()">Go to Login</button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .verify-email-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      padding: 20px;
    }
    
    mat-card {
      max-width: 400px;
      width: 100%;
    }
    
    .loading-spinner {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 20px 0;
    }
    
    .success-message {
      color: green;
      text-align: center;
      margin: 20px 0;
    }
    
    .error-message {
      color: red;
      text-align: center;
      margin: 20px 0;
    }
    
    mat-card-actions {
      display: flex;
      justify-content: center;
    }
  `]
})
export class VerifyEmailComponent implements OnInit {
  loading = true;
  success = false;
  error = false;
  errorMessage = 'Failed to verify email.';
  
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  
  ngOnInit(): void {
    // Get the action code from the URL
    this.route.queryParams.subscribe(params => {
      const actionCode = params['oobCode'];
      
      if (actionCode) {
        this.verifyEmail(actionCode);
      } else {
        this.loading = false;
        this.error = true;
        this.errorMessage = 'No verification code found in the URL.';
      }
    });
  }
  
  verifyEmail(actionCode: string): void {
    this.authService.verifyEmail(actionCode).pipe(
      catchError(error => {
        this.error = true;
        this.errorMessage = error.message || 'Failed to verify email.';
        return of(null);
      }),
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: () => {
        if (!this.error) {
          this.success = true;
        }
      }
    });
  }
  
  goToLogin(): void {
    this.router.navigate(['/account/login']);
  }
}
