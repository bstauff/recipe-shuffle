import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MealPlanComponent } from './meal-plan.component';
import { LoginGuard } from '../account/login.guard';

const routes: Routes = [
  { path: '', component: MealPlanComponent, canActivate: [LoginGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MealPlanRoutingModule {}
