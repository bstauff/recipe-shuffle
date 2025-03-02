import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../shared/auth.service';
import { Router } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-email-verification',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  template: `
    <div class="email-verification-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Email Verification Required</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="verification-status">
            <mat-icon color="warn">warning</mat-icon>
            <p>Your email address has not been verified.</p>
          </div>
          
          <p>
            Please check your email for a verification link. If you didn't receive an email, 
            you can request a new verification link below.
          </p>
          
          <div *ngIf="loading" class="loading-spinner">
            <mat-spinner diameter="30"></mat-spinner>
            <p>Sending verification email...</p>
          </div>
          
          <div *ngIf="success" class="success-message">
            <mat-icon color="primary">check_circle</mat-icon>
            <p>Verification email sent successfully! Please check your inbox.</p>
          </div>
          
          <div *ngIf="error" class="error-message">
            <mat-icon color="warn">error</mat-icon>
            <p>{{ errorMessage }}</p>
          </div>
        </mat-card-content>
        <mat-card-actions>
          <button 
            mat-raised-button 
            color="primary" 
            (click)="sendVerificationEmail()" 
            [disabled]="loading">
            Resend Verification Email
          </button>
          <button 
            mat-button 
            (click)="logout()">
            Logout
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .email-verification-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      padding: 20px;
    }
    
    mat-card {
      max-width: 500px;
      width: 100%;
    }
    
    .verification-status {
      display: flex;
      align-items: center;
      margin: 20px 0;
      gap: 10px;
    }
    
    .verification-status mat-icon {
      font-size: 24px;
      height: 24px;
      width: 24px;
    }
    
    .loading-spinner {
      display: flex;
      align-items: center;
      margin: 20px 0;
      gap: 10px;
    }
    
    .success-message, .error-message {
      display: flex;
      align-items: center;
      margin: 20px 0;
      gap: 10px;
    }
    
    .success-message {
      color: #3f51b5;
    }
    
    .error-message {
      color: #f44336;
    }
    
    mat-card-actions {
      display: flex;
      justify-content: space-between;
    }
  `]
})
export class EmailVerificationComponent {
  loading = false;
  success = false;
  error = false;
  errorMessage = '';
  
  private authService = inject(AuthService);
  private router = inject(Router);
  
  sendVerificationEmail(): void {
    this.loading = true;
    this.success = false;
    this.error = false;
    
    this.authService.sendVerificationEmail().pipe(
      catchError(error => {
        this.error = true;
        this.errorMessage = error.message || 'Failed to send verification email.';
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
  
  logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/account/login']);
    });
  }
}
