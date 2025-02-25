import { Component, NgZone, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { SupabaseService } from 'src/app/shared/supabase.service';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-logout',
    templateUrl: './logout.component.html',
    styleUrls: ['./logout.component.scss'],
    imports: [MatButton]
})
export class LogoutComponent implements OnDestroy {
  destroy$ = new Subject();

  constructor(
    private supabaseService: SupabaseService,
    private router: Router,
    private zone: NgZone
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  handleLogout(): void {
    this.supabaseService
      .logoutUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe({ complete: () => this.router.navigate(['/account/login']) });
  }
}
