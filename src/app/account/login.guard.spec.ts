import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  UrlTree,
} from '@angular/router';

import { LoginGuard } from './login.guard';
import { SupabaseService } from '../shared/supabase.service';
import { Observable, of } from 'rxjs';

describe('LoginGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => LoginGuard(...guardParameters));

  const supabaseSpy = jasmine.createSpyObj('SupabaseService', [
    'isUserLoggedIn',
  ]);
  const routerStateSnapshotSpy = jasmine.createSpyObj('RouterStateSnapshot', [
    'toString',
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: SupabaseService, useValue: supabaseSpy }],
    });
  });

  it('should be created', () => {
    supabaseSpy;
    expect(executeGuard).toBeTruthy();
  });

  it('should return true if user is logged in', (done: DoneFn) => {
    supabaseSpy.isUserLoggedIn.and.returnValue(of(true));
    let canActivate$ = executeGuard(
      new ActivatedRouteSnapshot(),
      routerStateSnapshotSpy
    );

    canActivate$ = canActivate$ as Observable<boolean | UrlTree>;

    canActivate$.subscribe({
      next: (result: boolean | UrlTree) => {
        expect(result).toBeTrue();
        done();
      },
    });
  });
  it('should return redirect to log in if user is not logged in', (done: DoneFn) => {
    supabaseSpy.isUserLoggedIn.and.returnValue(of(false));
    let canActivate$ = executeGuard(
      new ActivatedRouteSnapshot(),
      routerStateSnapshotSpy
    );

    canActivate$ = canActivate$ as Observable<boolean | UrlTree>;

    canActivate$.subscribe({
      next: (result: boolean | UrlTree) => {
        expect(result.toString()).toBe('/account/login');
        done();
      },
    });
  });
});
