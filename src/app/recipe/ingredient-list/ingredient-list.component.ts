import { Component, Input, WritableSignal, signal } from '@angular/core';
import { RecipeIngredient } from '../models/recipeingredient';
import { EditRecipeIngredientComponent } from '../edit-recipe-ingredient/edit-recipe-ingredient.component';
import { Ingredient } from '../models/ingredient';

@Component({
  selector: 'app-ingredient-list',
  standalone: true,
  imports: [EditRecipeIngredientComponent],
  templateUrl: './ingredient-list.component.html',
  styleUrl: './ingredient-list.component.scss',
})
export class IngredientListComponent {
  ingredients: WritableSignal<RecipeIngredient[]> = signal([
    {
      ingredient: {
        key: 'd12342b5-c9fe-4622-8180-a88b2ea614f8',
        name: 'apples',
        units: 'bunches',
      },
      key: '9e319eab-3145-4fc1-aba1-1666e2ac5694',
      quantity: 5,
    },
    {
      ingredient: {
        key: '60092cd6-5330-45b7-9185-767c774de5f0',
        name: 'Ham',
        units: 'lbs',
      },
      key: '2dcf5874-0e7f-4a46-b2bf-aadb3e07ef59',
      quantity: 3,
    },
  ]);

  @Input({ required: true })
  recipeKey!: string;

  onAddClicked(): void {
    const ingredients = this.ingredients();

    ingredients.push(new RecipeIngredient(new Ingredient('', ''), 0));

    this.ingredients.set(ingredients);
  }
}
