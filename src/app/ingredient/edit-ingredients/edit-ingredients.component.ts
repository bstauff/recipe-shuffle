import { Component, Input, WritableSignal, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RecipeService } from 'src/app/recipe/recipe.service';
import { RecipeIngredient } from '../models/recipe-ingredient';
import { EditIngredientComponent } from '../edit-ingredient/edit-ingredient.component';
import { Ulid } from 'id128';

@Component({
  selector: 'app-edit-ingredients',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, EditIngredientComponent],
  templateUrl: './edit-ingredients.component.html',
  styleUrl: './edit-ingredients.component.scss',
})
export class EditIngredientsComponent {
  @Input({ required: true })
  recipeKey!: string;

  recipeIngredients: WritableSignal<RecipeIngredient[]> = signal([]);

  constructor(private recipeService: RecipeService) {}

  onAddClicked(): void {
    const ingredient: RecipeIngredient = {
      ingredientKey: Ulid.generate().toCanonical(),
      ingredientName: '',
      ingredientUnit: '',
      key: Ulid.generate().toCanonical(),
      quantity: 0,
      recipeKey: this.recipeKey,
    };

    const updatedIngredients = [...this.recipeIngredients(), ingredient];
    console.log('ingredients', updatedIngredients);
    this.recipeIngredients.set(updatedIngredients);
  }
}