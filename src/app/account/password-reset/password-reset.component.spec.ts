import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';

import { PasswordResetComponent } from './password-reset.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('PasswordResetComponent', () => {
  let component: PasswordResetComponent;
  let fixture: ComponentFixture<PasswordResetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MatFormFieldModule,
        ReactiveFormsModule,
        MatInputModule,
        MatButtonModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        MatSnackBarModule,
        PasswordResetComponent,
      ],
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
});
