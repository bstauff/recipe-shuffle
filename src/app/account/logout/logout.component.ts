import { Component, NgZone, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
  imports: [MatButton],
})
export class LogoutComponent implements OnDestroy {
  destroy$ = new Subject();

  constructor(private router: Router, private zone: NgZone) {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  handleLogout(): void {
    this.zone.runOutsideAngular(() => {
      this.router.navigate(['/account/login']);
    });
  }
}
