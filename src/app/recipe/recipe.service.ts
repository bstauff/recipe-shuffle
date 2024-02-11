import { Injectable } from '@angular/core';
import { Recipe } from './models/recipe';
import { Observable, ReplaySubject } from 'rxjs';
import { SupabaseService } from '../shared/supabase.service';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  private recipeCollection: { [key: string]: Recipe } = {};

  private recipesChanged = new ReplaySubject<Recipe[]>(1);
  recipesChanged$: Observable<Recipe[]> = this.recipesChanged.asObservable();

  constructor(private supabaseService: SupabaseService) {
    this.supabaseService.getRecipes().subscribe((recipes) => {
      recipes.forEach((recipe) => {
        this.recipeCollection[recipe.key] = recipe;
      });
      this.recipesChanged.next(Object.values(this.recipeCollection));
    });
  }

  private pushRecipesUpdated(): void {
    this.recipesChanged.next(Object.values(this.recipeCollection));
  }
}
