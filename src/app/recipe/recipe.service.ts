import { Injectable } from '@angular/core';
import { Recipe } from './models/recipe';
import { ReplaySubject } from 'rxjs';
import { SupabaseService } from '../shared/supabase.service';

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
    const recipeCopy = {
      ...recipe,
      is_deleted: true,
      ingredients: [
        ...recipe.ingredients.map((ingredient) => {
          return {
            ...ingredient,
            is_deleted: true,
          };
        }),
      ],
    };
    this.supabaseService.upsertRecipe(recipeCopy).subscribe((response) => {
      if (response.isError) {
        console.error('supabase upsert failed', response.errorMessage);
      } else {
        recipe.is_deleted = true;
        recipe.ingredients = recipe.ingredients.map((ingredient) => {
          return { ...ingredient, is_deleted: true };
        });
        delete this.recipeCollection[recipe.key];
        this.recipesChanged.next(Object.values(this.recipeCollection));
      }
    });
  }

  upsertRecipe(recipe: Recipe): void {
    this.supabaseService.upsertRecipe(recipe).subscribe((response) => {
      if (response.isError) {
        console.error('supabase upsert failed', response.errorMessage);
      } else {
        if (!this.recipeCollection[recipe.key]) {
          this.recipeCollection[recipe.key] = recipe;
          this.recipesChanged.next(Object.values(this.recipeCollection));
        }
      }
    });
  }
}
