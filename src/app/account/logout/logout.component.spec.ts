import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { LogoutComponent } from './logout.component';
import { SupabaseService } from 'src/app/shared/supabase.service';
import { EMPTY } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, provideRouter } from '@angular/router';
import { LoginComponent } from '../login/login.component';

describe('LogoutComponent', () => {
  let component: LogoutComponent;
  let fixture: ComponentFixture<LogoutComponent>;
  let supabaseSpy: jasmine.SpyObj<SupabaseService>;

  beforeEach(() => {
    supabaseSpy = jasmine.createSpyObj('SupabaseService', ['logoutUser']);
    supabaseSpy.logoutUser.and.returnValue(EMPTY);

    TestBed.configureTestingModule({
      declarations: [LogoutComponent],
      imports: [RouterTestingModule],
      providers: [
        provideRouter([{ path: 'account/login', component: LoginComponent }]),
      ],
    });
    TestBed.overrideProvider(SupabaseService, { useValue: supabaseSpy });
    fixture = TestBed.createComponent(LogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call supabase service to logout when logout is clicked', () => {
    component.handleLogout();
    expect(supabaseSpy.logoutUser).toHaveBeenCalled();
  });

  it('should navigate to account login when supabase completes', fakeAsync(() => {
    component.handleLogout();
    tick();
    const router = TestBed.inject(Router);
    expect(router.url).toBe('/account/login');
  }));
});
