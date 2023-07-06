import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuard } from './account/login.guard';

const routes: Routes = [
  {
    path: 'recipes',
    canActivate: [LoginGuard],
    loadChildren: () =>
      import('./recipe/recipe.module').then((m) => m.RecipeModule),
  },
  {
    path: 'account',
    loadChildren: () =>
      import('./account/account.module').then((m) => m.AccountModule),
  },
  {
    path: 'meal-plan',
    canActivate: [LoginGuard],
    loadChildren: () =>
      import('./meal-plan/meal-plan.module').then((m) => m.MealPlanModule),
  },
  {
    path: '**',
    redirectTo: 'recipes',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
