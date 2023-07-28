import { Injectable } from '@angular/core';
import { Recipe } from './models/recipe';
import { Observable, ReplaySubject } from 'rxjs';
import { SupabaseService } from '../shared/supabase.service';
import { Ingredient } from './models/ingredient';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  private recipeCollection: { [key: string]: Recipe } = {};

  private recipesChanged = new ReplaySubject<Recipe[]>(1);
  recipesChanged$: Observable<Recipe[]> = this.recipesChanged.asObservable();

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
        this.pushRecipesUpdated();
      },
      error: (err) => console.error('error deleting recipe', err),
    });
  }

  deleteIngredients(ingredients: Ingredient[]): void {
    this.supabaseService.deleteIngredients(ingredients).subscribe({
      complete: () => {
        this.pushRecipesUpdated();
      },
      error: (err) => console.error('error deleting ingredients', err),
    });
  }

  upsertRecipe(recipe: Recipe): void {
    this.supabaseService.upsertRecipe(recipe).subscribe({
      complete: () => {
        this.recipeCollection[recipe.key] = recipe;
        this.pushRecipesUpdated();
      },
      error: (err) => console.error('error upserting recipe', err),
    });
  }

  private pushRecipesUpdated(): void {
    this.recipesChanged.next(Object.values(this.recipeCollection));
  }
}
