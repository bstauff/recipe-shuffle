import { Routes } from '@angular/router';
import { RecipeListComponent } from './recipe/recipe-list/recipe-list.component';
import { AccountComponent } from './account/account.component';
import { LoginComponent } from './account/login/login.component';
import { NewPasswordComponent } from './account/password-reset/new-password/new-password.component';
import { PasswordResetComponent } from './account/password-reset/password-reset.component';
import { RegisterComponent } from './account/register/register.component';
import { MealPlanComponent } from './meal-plan/meal-plan.component';
import { EditRecipeComponent } from './recipe/edit-recipe/edit-recipe.component';
import { VerifyEmailComponent } from './account/verify-email/verify-email.component';
import { EmailVerificationComponent } from './account/email-verification/email-verification.component';
import { authGuard } from './shared/auth.guard';
import { emailVerifiedGuard } from './shared/email-verified.guard';

export const routes: Routes = [
  {
    path: 'recipes',
    component: RecipeListComponent,
    canActivate: [],
  },
  {
    path: 'recipes/edit/:recipeKey',
    component: EditRecipeComponent,
    canActivate: [],
  },
  {
    path: 'account',
    component: AccountComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
      {
        path: 'password-reset',
        component: PasswordResetComponent,
      },
      {
        path: 'password-reset/new-password',
        component: NewPasswordComponent,
      },
      {
        path: 'verify-email',
        component: VerifyEmailComponent,
      },
    ],
  },
  {
    path: 'email-verification',
    component: EmailVerificationComponent,
    canActivate: [authGuard],
  },
  {
    path: 'meal-plan',
    component: MealPlanComponent,
    canActivate: [authGuard, emailVerifiedGuard],
  },
  {
    path: '**',
    redirectTo: 'recipes',
  },
];
