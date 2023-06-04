import { Injectable } from '@angular/core';
import { Recipe } from './models/recipe';
import { ReplaySubject } from 'rxjs';
import { SupabaseService } from '../shared/supabase.service';

@Injectable()
export class RecipeService {
  private recipes: Recipe[] = [];

  recipesChanged = new ReplaySubject<Recipe[]>(1);

  constructor(private supabaseService: SupabaseService) {
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(recipe: Recipe): void {
    const recipeIndex = this.recipes.findIndex(
      (rec) => rec.name === recipe.name
    );
    this.recipes.splice(recipeIndex, 1);
    this.recipesChanged.next(this.recipes.slice());
  }

  upsertRecipe(recipe: Recipe): void {
    console.log('calling supabase to insert reciope...');
    this.supabaseService.insertRecipe(recipe).subscribe((response) => {
      if (response.error) {
        console.error('supabase insert failed', response.error);
      }
    });
    // const recipeIndex = this.recipes.findIndex(
    //   (rec) => rec.name === recipe.name
    // );

    // if (recipeIndex === -1) {
    //   this.recipes.push(recipe);
    // } else {
    //   this.recipes[recipeIndex] = recipe;
    // }

    // this.recipesChanged.next(this.recipes.slice());
  }
}
