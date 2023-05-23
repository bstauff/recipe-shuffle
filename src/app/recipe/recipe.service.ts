import { Injectable } from '@angular/core';
import { Recipe } from './models/recipe';
import { BehaviorSubject } from 'rxjs';

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

  recipesChanged = new BehaviorSubject<Recipe[]>(this.recipes.slice());

  addRecipe(recipe: Recipe): void {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number): void {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }
}
