import { Component, Input } from '@angular/core';
import { IngredientListComponent } from '../ingredient-list/ingredient-list.component';

@Component({
  selector: 'app-edit-ingredients',
  standalone: true,
  imports: [IngredientListComponent],
  templateUrl: './edit-ingredients.component.html',
  styleUrl: './edit-ingredients.component.scss',
})
export class EditIngredientsComponent {
  @Input({ required: true })
  recipeKey = '';
}
