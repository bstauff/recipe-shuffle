import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MealPlanRoutingModule } from './meal-plan-routing.module';
import { MealPlanComponent } from './meal-plan.component';


@NgModule({
  declarations: [
    MealPlanComponent
  ],
  imports: [
    CommonModule,
    MealPlanRoutingModule
  ]
})
export class MealPlanModule { }
