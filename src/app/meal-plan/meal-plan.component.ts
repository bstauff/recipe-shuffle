import { Component } from '@angular/core';
import { ShuffleComponent } from './shuffle/shuffle.component';

@Component({
    selector: 'app-meal-plan',
    templateUrl: './meal-plan.component.html',
    styleUrls: ['./meal-plan.component.scss'],
    standalone: true,
    imports: [ShuffleComponent]
})
export class MealPlanComponent {

}
