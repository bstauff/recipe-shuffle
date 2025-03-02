import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-user-status',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  template: `
    <div class="user-status">
      <ng-container *ngIf="(isLoggedIn$ | async)">
        <span class="user-email">{{ (currentUser$ | async)?.email }}</span>
        <button mat-button (click)="logout()">Logout</button>
      </ng-container>
    </div>
  `,
  styles: [`
    .user-status {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .user-email {
      font-weight: 500;
    }
  `]
})
export class UserStatusComponent {
  private authService = inject(AuthService);
  
  currentUser$: Observable<User | null> = this.authService.getCurrentUser();
  isLoggedIn$: Observable<boolean> = this.authService.isLoggedIn$;
  
  logout() {
    this.authService.logout().subscribe();
  }
}
