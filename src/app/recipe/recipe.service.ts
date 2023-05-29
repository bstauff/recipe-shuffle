import { Injectable } from '@angular/core';
import { Recipe } from './models/recipe';
import { ReplaySubject } from 'rxjs';

@Injectable()
export class RecipeService {
  private recipes: Recipe[] = [];

  recipesChanged = new ReplaySubject<Recipe[]>(1);

  constructor() {
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
    const recipeIndex = this.recipes.findIndex(
      (rec) => rec.name === recipe.name
    );

    if (recipeIndex === -1) {
      this.recipes.push(recipe);
    } else {
      this.recipes[recipeIndex] = recipe;
    }

    this.recipesChanged.next(this.recipes.slice());
  }
}
