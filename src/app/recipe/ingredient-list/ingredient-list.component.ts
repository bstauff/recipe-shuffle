import { Component, Input } from '@angular/core';
import { RecipeIngredient } from '../models/recipeingredient';

@Component({
  selector: 'app-ingredient-list',
  standalone: true,
  imports: [],
  templateUrl: './ingredient-list.component.html',
  styleUrl: './ingredient-list.component.scss',
})
export class IngredientListComponent {
  @Input({ required: true })
  ingredients: RecipeIngredient[] = [];

  onAddIngredient(): void {
    console.log('add stuff');
  }
}
