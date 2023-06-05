import { Injectable } from '@angular/core';
import { Recipe } from './models/recipe';
import { ReplaySubject } from 'rxjs';
import { SupabaseService } from '../shared/supabase.service';

@Injectable()
export class RecipeService {
  private recipes: Recipe[] = [];

  recipesChanged = new ReplaySubject<Recipe[]>(1);

  constructor(private supabaseService: SupabaseService) {
    this.supabaseService.getRecipes().subscribe((recipes) => {
      this.recipes = recipes;
      this.recipesChanged.next(recipes);
    });
  }

  deleteRecipe(recipe: Recipe): void {
    const recipeIndex = this.recipes.findIndex(
      (rec) => rec.name === recipe.name
    );
    this.recipes.splice(recipeIndex, 1);
    this.recipesChanged.next(this.recipes.slice());
  }
  upsertRecipe(recipe: Recipe): void {
    if (recipe.id < 0) {
      this.supabaseService.insertRecipe(recipe).subscribe((response) => {
        if (response.error) {
          console.error('supabase insert failed', response.error);
        }
        recipe.id = response.createdId;
        this.recipes.push(recipe);
        this.recipesChanged.next(this.recipes.slice());
      });
    } else {
      this.supabaseService.updateRecipe(recipe).subscribe((response) => {
        if (response.error) {
          console.error('supabase insert failed', response.error);
        }
        this.recipesChanged.next(this.recipes.slice());
      });
    }
  }
}
