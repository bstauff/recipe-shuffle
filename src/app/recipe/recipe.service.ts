import { Injectable } from '@angular/core';
import { Recipe } from './models/recipe';
import { ReplaySubject } from 'rxjs';

@Injectable()
export class RecipeService {
  private recipes: Recipe[] = [
    {
      name: 'Test Recipe 0',
      ingredients: [],
      url: '',
    },
    {
      name: 'Test Recipe 1',
      ingredients: [],
      url: '',
    },
    {
      name: 'Test Recipe 2',
      ingredients: [],
      url: '',
    },
  ];

  recipesChanged = new ReplaySubject<Recipe[]>(1);

  constructor() {
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number): void {
    this.recipes.splice(index, 1);
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
