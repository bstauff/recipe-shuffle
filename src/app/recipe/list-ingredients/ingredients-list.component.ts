import { Component, Input, WritableSignal, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RecipeService } from 'src/app/recipe/recipe.service';
import { EditIngredientComponent } from '../edit-ingredient/edit-ingredient.component';
import { Ingredient, newIngredientKey } from '../models/ingredient';

@Component({
  selector: 'app-ingredients-list',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, EditIngredientComponent],
  templateUrl: './ingredients-list.component.html',
  styleUrl: './ingredients-list.component.scss',
})
export class IngredientsListComponent {
  @Input({ required: true })
  recipeKey!: string;

  recipeIngredients: WritableSignal<Ingredient[]> = signal([]);

  constructor(private recipeService: RecipeService) {}

  onAddClicked(): void {
    const ingredient: Ingredient = {
      key: newIngredientKey(),
      name: '',
      units: '',
      quantity: 0,
      recipeKey: this.recipeKey,
    };

    const updatedIngredients = [...this.recipeIngredients(), ingredient];
    this.recipeIngredients.set(updatedIngredients);
  }

  onIngredientDeleted(ingredient: Ingredient): void {
    this.recipeService.deleteIngredient(ingredient.key).subscribe({
      complete: () => {
        const newIngredients = this.recipeIngredients().filter(
          (x) => x.key !== ingredient.key
        );
        console.log('delete succeeded.  new ingredients: ', newIngredients);
        this.recipeIngredients.set(newIngredients);
      },
    });
  }
}
