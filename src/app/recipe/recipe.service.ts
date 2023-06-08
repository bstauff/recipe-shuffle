import { Injectable } from '@angular/core';
import { Recipe } from './models/recipe';
import { ReplaySubject } from 'rxjs';
import { SupabaseService } from '../shared/supabase.service';
import { Ingredient } from './models/ingredient';

@Injectable()
export class RecipeService {
  private recipeCollection: { [key: string]: Recipe } = {};

  recipesChanged = new ReplaySubject<Recipe[]>(1);

  constructor(private supabaseService: SupabaseService) {
    this.supabaseService.getRecipes().subscribe((recipes) => {
      recipes.forEach((recipe) => {
        this.recipeCollection[recipe.key] = recipe;
      });
      this.recipesChanged.next(Object.values(this.recipeCollection));
    });
  }

  deleteRecipe(recipe: Recipe): void {
    this.supabaseService.deleteRecipe(recipe).subscribe({
      complete: () => {
        delete this.recipeCollection[recipe.key];
        this.recipesChanged.next(Object.values(this.recipeCollection));
      },
      error: (err) => console.error('error deleting recipe', err),
    });
  }

  deleteIngredients(ingredients: Ingredient[]): void {
    this.supabaseService.deleteIngredients(ingredients).subscribe({
      complete: () => {
        this.recipesChanged.next(Object.values(this.recipeCollection));
      },
      error: (err) => console.error('error deleting ingredients', err),
    });
  }

  upsertRecipe(recipe: Recipe): void {
    this.supabaseService.upsertRecipe(recipe).subscribe({
      complete: () => {
        if (!this.recipeCollection[recipe.key]) {
          this.recipeCollection[recipe.key] = recipe;
          this.recipesChanged.next(Object.values(this.recipeCollection));
        }
        console.log('completed recipe upsert');
      },
      error: (err) => console.error('error upserting recipe', err),
    });
  }
}
