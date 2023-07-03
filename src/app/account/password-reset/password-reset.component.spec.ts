import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flush,
  tick,
} from '@angular/core/testing';

import { PasswordResetComponent } from './password-reset.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from 'src/app/shared/shared.module';
import { SupabaseService } from 'src/app/shared/supabase.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { of } from 'rxjs';

describe('PasswordResetComponent', () => {
  let component: PasswordResetComponent;
  let fixture: ComponentFixture<PasswordResetComponent>;
  let supabaseSpy: jasmine.SpyObj<SupabaseService>;

  beforeEach(() => {
    supabaseSpy = jasmine.createSpyObj('SupabaseService', [
      'initiatePasswordReset',
    ]);
    supabaseSpy.initiatePasswordReset.and.returnValue(of());
    TestBed.configureTestingModule({
      declarations: [PasswordResetComponent],
      imports: [
        MatFormFieldModule,
        ReactiveFormsModule,
        MatInputModule,
        MatButtonModule,
        SharedModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        MatSnackBarModule,
      ],
    });
    TestBed.overrideProvider(SupabaseService, {
      useValue: supabaseSpy,
    });
    fixture = TestBed.createComponent(PasswordResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should require email', fakeAsync(() => {
    const emailControl = component.resetEmailCollection.get('email');
    emailControl?.setValue('');
    emailControl?.markAsTouched();
    emailControl?.markAsDirty();
    expect(component.resetEmailCollection.valid).toBeFalse();
  }));

  it('should call initiatePasswordReset on SupabaseService when submit is clicked', fakeAsync(() => {
    const expectedEmail = 'john@gmail.com';
    component.resetEmailCollection.get('email')?.setValue(expectedEmail);
    component.onSubmit();
    tick();
    flush();
    expect(supabaseSpy.initiatePasswordReset).toHaveBeenCalledWith(
      expectedEmail
    );
  }));
});
