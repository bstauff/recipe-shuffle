import { Injectable } from '@angular/core';
import { Recipe } from './models/recipe';
import { ReplaySubject } from 'rxjs';

@Injectable()
export class RecipeService {
  private recipes: Recipe[] = [
    {
      name: 'Pancakes',
      url: 'https://www.allrecipes.com/recipe/21014/good-old-fashioned-pancakes/',
      ingredients: [
        { name: 'Flour', quantity: 5 },
        { name: 'Eggs', quantity: 2 },
        { name: 'Milk', quantity: 1 },
      ]
    },
    {
      name: 'Oatmeal',
      url: 'https://www.allrecipes.com/recipe/272383/overnight-oats-with-yogurt/',
      ingredients: [
        { name: 'Oatmeal', quantity: 5 },
        { name: 'Yogurt', quantity: 1 },
        { name: 'Milk', quantity: 1 },
      ]
    }
  ];

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
