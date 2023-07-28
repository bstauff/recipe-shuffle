import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MealPlanRoutingModule } from './meal-plan-routing.module';
import { MealPlanComponent } from './meal-plan.component';
import { ShuffleComponent } from './shuffle/shuffle.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [MealPlanComponent, ShuffleComponent],
  imports: [
    CommonModule,
    MealPlanRoutingModule,
    MatButtonModule,
    MatCardModule,
  ],
})
export class MealPlanModule {}
