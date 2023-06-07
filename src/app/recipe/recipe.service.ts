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
    // const recipeIndex = this.recipes.findIndex((rec) => rec.id === recipe.id);
    // this.supabaseService.deleteRecipe(recipe).subscribe((response) => {
    //   if (response.error) {
    //     console.error('supabase delete failed', response.error);
    //   } else {
    //     this.recipes.splice(recipeIndex, 1);
    //     this.recipesChanged.next(this.recipes.slice());
    //   }
    // });
  }
  upsertRecipe(recipe: Recipe): void {
    this.supabaseService.upsertRecipe(recipe).subscribe((response) => {
      if (response.isError) {
        console.error('supabase upsert failed', response.errorMessage);
      }

      if (!this.recipeCollection[recipe.key]) {
        this.recipeCollection[recipe.key] = recipe;
        this.recipesChanged.next(Object.values(this.recipeCollection));
      }
    });
  }
}
