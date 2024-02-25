import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Recipe } from './models/recipe';
import { Observable, ReplaySubject, tap } from 'rxjs';
import { SupabaseService } from '../shared/supabase.service';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  private recipeCollection: Map<string, Recipe> = new Map<string, Recipe>();

  private recipesChanged = new ReplaySubject<Recipe[]>(1);
  recipesChanged$: Observable<Recipe[]> = this.recipesChanged.asObservable();

  private destroyRef = inject(DestroyRef);

  constructor(private supabaseService: SupabaseService) {}

  private pushRecipesUpdated(): void {
    this.recipesChanged.next(
      Object.values([...this.recipeCollection.values()])
    );
  }

  addRecipe(recipe: Recipe): Observable<Recipe> {
    return this.supabaseService.upsertRecipe(recipe).pipe(
      takeUntilDestroyed(this.destroyRef),
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
