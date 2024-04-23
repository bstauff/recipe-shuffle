import { Injectable } from '@angular/core';
import { Recipe } from './models/recipe';
import { Observable, ReplaySubject, map } from 'rxjs';
import { SupabaseService } from '../shared/supabase.service';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  private recipeCollection: Map<number, Recipe> = new Map<number, Recipe>();

  private recipesChanged = new ReplaySubject<Recipe[]>(1);
  recipesChanged$: Observable<Recipe[]> = this.recipesChanged.asObservable();

  constructor(private supabaseService: SupabaseService) {
    supabaseService
      .getRecipes()
      .pipe(
        map((recipes: Recipe[]) => {
          return new Map(recipes.map((recipe) => [recipe.id!, recipe]));
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

  // upsertRecipe(recipe: Recipe): Observable<Recipe> {
  //   // upsert recipe
  //   return this.supabaseService
  //     .upsertRecipe(recipe)
  //     .pipe(
  //       tap((upsertedRecipe: Recipe) =>
  //         this.updateRecipeInCollection(upsertedRecipe)
  //       )
  //     );
  // }

  getRecipe(recipeId: number): Observable<Recipe> {
    return this.supabaseService.getRecipe(recipeId);
  }

  private updateRecipeInCollection(recipe: Recipe) {
    if (!recipe.id) {
      throw new Error('no id on recipe');
    }
    if (this.recipeCollection.has(recipe.id)) {
      const existingRecipe = this.recipeCollection.get(recipe.id) as Recipe;
      existingRecipe.name = recipe.name;
      existingRecipe.url = recipe.url;
    } else {
      this.recipeCollection.set(recipe.id, recipe);
    }

    this.pushRecipesUpdated();
  }
}
