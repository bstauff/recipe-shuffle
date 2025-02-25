import {
  TestBed,
  fakeAsync,
  waitForAsync,
} from '@angular/core/testing';
import { LogoutComponent } from './logout.component';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideRouter } from '@angular/router';
import { LoginComponent } from '../login/login.component';

describe('LogoutComponent', () => {
  let component: LogoutComponent;
  let harness: RouterTestingHarness;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [LogoutComponent],
      providers: [
        provideRouter([
          {
            path: 'account/login',
            component: LoginComponent,
          },
          {
            path: '**',
            component: LogoutComponent,
          },
        ]),
      ],
    }).compileComponents();

    harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl('/', LogoutComponent);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to login page on logout', fakeAsync(async () => {
    component.handleLogout();
    await harness.navigateByUrl('/account/login');
    expect(harness.routeNativeElement?.tagName.toLowerCase()).toBe('app-login');
  }));
});
