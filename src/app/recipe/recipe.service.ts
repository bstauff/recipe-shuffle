import { Injectable } from '@angular/core';
import { Recipe } from './models/recipe';
import { Observable, ReplaySubject, map, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  private recipeCollection: Map<number, Recipe> = new Map<number, Recipe>();
  private readonly STORAGE_KEY = 'recipes';

  private recipesChanged = new ReplaySubject<Recipe[]>(1);
  recipesChanged$: Observable<Recipe[]> = this.recipesChanged.asObservable();

  constructor() {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage(): void {
    const storedRecipes = localStorage.getItem(this.STORAGE_KEY);
    if (storedRecipes) {
      const recipes: Recipe[] = JSON.parse(storedRecipes);
      this.recipeCollection = new Map(recipes.map(recipe => [recipe.id!, recipe]));
      this.pushRecipesUpdated();
    }
  }

  private saveToLocalStorage(): void {
    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify([...this.recipeCollection.values()])
    );
  }

  private pushRecipesUpdated(): void {
    this.recipesChanged.next(
      Array.from(this.recipeCollection.values())
    );
  }

  upsertRecipe(recipe: Recipe): Observable<Recipe> {
    if (!recipe.id) {
      recipe.id = Date.now();
    }
    this.recipeCollection.set(recipe.id, recipe);
    this.saveToLocalStorage();
    this.pushRecipesUpdated();
    return of(recipe);
  }

  getRecipe(recipeId: number): Observable<Recipe> {
    const recipe = this.recipeCollection.get(recipeId);
    return recipe ? of(recipe) : of();
  }

  deleteRecipe(recipeId: number): Observable<void> {
    this.recipeCollection.delete(recipeId);
    this.saveToLocalStorage();
    this.pushRecipesUpdated();
    return of(void 0);
  }

  getRecipes(): Observable<Recipe[]> {
    return of(Array.from(this.recipeCollection.values()));
  }
}
