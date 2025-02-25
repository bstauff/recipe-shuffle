import { TestBed, waitForAsync } from '@angular/core/testing';
import { NewPasswordComponent } from './new-password.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingHarness } from '@angular/router/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RecipeListComponent } from 'src/app/recipe/recipe-list/recipe-list.component';
import { provideRouter } from '@angular/router';

describe('NewPasswordComponent', () => {
  let component: NewPasswordComponent;
  let harness: RouterTestingHarness;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        BrowserAnimationsModule,
        MatSnackBarModule,
        NewPasswordComponent,
      ],
      providers: [
        provideRouter([
          {
            path: 'recipes',
            component: RecipeListComponent,
          },
          {
            path: '**',
            component: NewPasswordComponent,
          },
        ]),
      ],
    }).compileComponents();

    harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl('/', NewPasswordComponent);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a form with password and confirm password fields', () => {
    expect(component.confirmPasswordForm.get('password')).toBeTruthy();
    expect(component.confirmPasswordForm.get('confirmPassword')).toBeTruthy();
  });

});
