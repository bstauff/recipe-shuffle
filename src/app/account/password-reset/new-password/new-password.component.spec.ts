import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flush,
  tick,
} from '@angular/core/testing';

import { NewPasswordComponent } from './new-password.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SupabaseService } from 'src/app/shared/supabase.service';
import { EMPTY } from 'rxjs';
import { RecipeListComponent } from 'src/app/recipe/recipe-list/recipe-list.component';
import { provideRouter } from '@angular/router';

describe('NewPasswordComponent', () => {
  let component: NewPasswordComponent;
  let fixture: ComponentFixture<NewPasswordComponent>;
  let supabaseSpy: jasmine.SpyObj<SupabaseService>;

  beforeEach(() => {
    supabaseSpy = jasmine.createSpyObj('SupabaseService', ['updatePassword']);
    supabaseSpy.updatePassword.and.returnValue(EMPTY);
    TestBed.overrideProvider(SupabaseService, { useValue: supabaseSpy });
    TestBed.configureTestingModule({
      declarations: [NewPasswordComponent],
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
      providers: [
        provideRouter([{ path: 'recipes', component: RecipeListComponent }]),
      ],
    });
    fixture = TestBed.createComponent(NewPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should require matching passwords', () => {
    const expectedPassword = 'bananas';
    const expectedConfirmPass = 'apples';

    const passwordControl = component.confirmPasswordForm.get('password');
    passwordControl?.setValue(expectedPassword);
    passwordControl?.markAsDirty();
    passwordControl?.markAsTouched();

    const confirmPasswordControl =
      component.confirmPasswordForm.get('confirmPassword');
    confirmPasswordControl?.setValue(expectedConfirmPass);
    confirmPasswordControl?.markAsDirty();
    confirmPasswordControl?.markAsTouched();

    expect(
      component.confirmPasswordForm.hasError('passwordsDoNotMatch')
    ).toBeTrue();
  });

  it('should call supabaseservice update password on submit', fakeAsync(() => {
    const expectedPassword = 'bananas';
    const expectedConfirmPass = 'bananas';

    const passwordControl = component.confirmPasswordForm.get('password');
    passwordControl?.setValue(expectedPassword);

    const confirmPasswordControl =
      component.confirmPasswordForm.get('confirmPassword');
    confirmPasswordControl?.setValue(expectedConfirmPass);

    component.onSubmit();
    tick();
    flush();

    expect(supabaseSpy.updatePassword).toHaveBeenCalledWith(expectedPassword);
  }));
});
