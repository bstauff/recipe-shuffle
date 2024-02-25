import { Injectable } from '@angular/core';
import { Recipe } from './models/recipe';
import { Observable, ReplaySubject, map, tap } from 'rxjs';
import { SupabaseService } from '../shared/supabase.service';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  private recipeCollection: Map<string, Recipe> = new Map<string, Recipe>();

  private recipesChanged = new ReplaySubject<Recipe[]>(1);
  recipesChanged$: Observable<Recipe[]> = this.recipesChanged.asObservable();

  constructor(private supabaseService: SupabaseService) {
    supabaseService
      .getRecipes()
      .pipe(
        map((recipes: Recipe[]) => {
          return new Map(recipes.map((recipe) => [recipe.key, recipe]));
        })
      )
      .subscribe({
        next: (recipes) => {
          this.recipeCollection = recipes;
          this.pushRecipesUpdated();
        },
        error: (error) =>
          console.error('failed to fetch initial recipes', error),
      });
  }

  private pushRecipesUpdated(): void {
    this.recipesChanged.next(
      Object.values([...this.recipeCollection.values()])
    );
  }

  addRecipe(recipe: Recipe): Observable<Recipe> {
    return this.supabaseService
      .upsertRecipe(recipe)
      .pipe(
        tap((upsertedRecipe: Recipe) =>
          this.updateRecipeInCollection(upsertedRecipe)
        )
      );
  }

  private updateRecipeInCollection(recipe: Recipe) {
    if (this.recipeCollection.has(recipe.key)) {
      const existingRecipe = this.recipeCollection.get(recipe.key) as Recipe;
      existingRecipe.name = recipe.name;
      existingRecipe.url = recipe.url;
    } else {
      this.recipeCollection.set(recipe.key, recipe);
    }

    this.pushRecipesUpdated();
  }
}
