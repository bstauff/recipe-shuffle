import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { EMPTY, Observable, exhaustMap, from, map, of } from 'rxjs';
import { AuthResponse } from './models/AuthResponse';
import { Recipe } from '../recipe/models/recipe';
import { Database } from '../../../lib/database.types';
import { Ingredient } from '../recipe/models/ingredient';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabaseClient = createClient<Database>(
    'https://mktkekolltbsdrhufdtk.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rdGtla29sbHRic2RyaHVmZHRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODUzNzExMjMsImV4cCI6MjAwMDk0NzEyM30.5exOJ4rN_dfEeMwHK5yfmEJ_TFKTxHHq1xgd8KAdVgY'
  );

  signUpUser(email: string, password: string): Observable<AuthResponse> {
    return from(this.supabaseClient.auth.signUp({ email, password })).pipe(
      exhaustMap((signupResponse) => {
        if (signupResponse.error) {
          return of({
            isError: true,
            errorMessage: signupResponse.error.message,
          });
        }
        return of({ isError: false, errorMessage: '' });
      })
    );
  }
  logoutUser(): Observable<never> {
    return from(this.supabaseClient.auth.signOut()).pipe(
      exhaustMap((response) => {
        if (response?.error) {
          throw new Error(response?.error?.message);
        }
        return EMPTY;
      })
    );
  }
  loginUser(email: string, password: string): Observable<AuthResponse> {
    return from(
      this.supabaseClient.auth.signInWithPassword({ email, password })
    ).pipe(
      exhaustMap((loginResponse) => {
        if (loginResponse.error) {
          return of({
            isError: true,
            errorMessage: loginResponse.error.message,
          });
        }
        return of({ isError: false, errorMessage: '' });
      })
    );
  }
  isUserLoggedIn(): Observable<boolean> {
    return from(this.supabaseClient.auth.getSession()).pipe(
      exhaustMap((session) => {
        if (session.data.session) {
          return of(true);
        }
        return of(false);
      })
    );
  }

  getRecipes(): Observable<Recipe[]> {
    const recipes = this.supabaseClient.from('recipe').select(
      `
        recipe_key,
        name,
        url
      `
    );

    const recipes$ = from(recipes);

    return recipes$.pipe(
      map((response) => {
        if (!response.data) {
          throw new Error(response.error.message);
        }
        return response.data?.map((recipe) => {
          return {
            key: recipe.recipe_key,
            name: recipe.name,
            url: recipe.url,
            recipeIngredients: [],
            tags: [],
          };
        });
      })
    );
  }

  getRecipe(recipeKey: string): Observable<Recipe> {
    const recipe = this.supabaseClient
      .from('recipe')
      .select(
        `
        recipe_key,
        name,
        url
      `
      )
      .eq('recipe_key', recipeKey)
      .single();

    const recipe$ = from(recipe);
    return recipe$.pipe(
      map((response) => {
        if (!response.data) {
          throw new Error(response.error.message);
        }

        return {
          key: response.data?.recipe_key,
          name: response.data?.name,
          url: response.data?.url,
          recipeIngredients: [],
        };
      })
    );
  }

  upsertRecipe(recipe: Recipe): Observable<Recipe> {
    const userId$ = this.getUserId();
    return userId$.pipe(
      exhaustMap((userId) => {
        return from(
          this.supabaseClient
            .from('recipe')
            .upsert({
              recipe_key: recipe.key,
              name: recipe.name,
              url: recipe.url,
              user_id: userId,
            })
            .select()
        ).pipe(
          exhaustMap((upsertRecipeResponse) => {
            if (upsertRecipeResponse.error) {
              throw new Error(upsertRecipeResponse.error.message);
            }

            const upsertedRecipe = upsertRecipeResponse.data[0];
            return of({
              key: upsertedRecipe.recipe_key,
              name: upsertedRecipe.name,
              url: upsertedRecipe.url,
              recipeIngredients: [],
              tags: [],
            });
          })
        );
      })
    );
  }

  upsertIngredient(ingredient: Ingredient): Observable<Ingredient> {
    const userId$ = this.getUserId();

    return userId$.pipe(
      exhaustMap((userId) => {
        return from(
          this.supabaseClient
            .from('ingredient')
            .upsert({
              key: ingredient.key,
              name: ingredient.name,
              units: ingredient.units,
              user_id: userId,
            })
            .select()
        ).pipe(
          map((upsertedIngredientResponse) => {
            if (upsertedIngredientResponse.error) {
              throw new Error(upsertedIngredientResponse.error.message);
            }

            return upsertedIngredientResponse.data[0];
          }),
          map((upsertedIngredient) => {
            return {
              key: upsertedIngredient.key,
              name: upsertedIngredient.name,
              units: upsertedIngredient.units,
            };
          })
        );
      })
    );
  }

  deleteIngredient(ingredientKey: string): Observable<never> {
    return from(
      this.supabaseClient.from('ingredient').delete().eq('key', ingredientKey)
    ).pipe(
      exhaustMap((response) => {
        if (response.error) {
          throw new Error(response.error.message);
        }
        return EMPTY;
      })
    );
  }

  deleteRecipe(recipe: Recipe): Observable<never> {
    return from(
      this.supabaseClient.from('recipe').delete().eq('key', recipe.key)
    ).pipe(
      exhaustMap((response) => {
        if (response.error) {
          throw new Error(response.error.message);
        }
        return EMPTY;
      })
    );
  }

  initiatePasswordReset(userEmail: string): Observable<never> {
    return from(
      this.supabaseClient.auth.resetPasswordForEmail(userEmail, {
        redirectTo:
          'https://recipe-shuffle.braynesoft.net/account/password-reset/new-password',
      })
    ).pipe(
      exhaustMap((data) => {
        if (data.error) throw new Error(data.error.message);
        return EMPTY;
      })
    );
  }

  updatePassword(newPassword: string): Observable<never> {
    return from(
      this.supabaseClient.auth.updateUser({ password: newPassword })
    ).pipe(
      exhaustMap((data) => {
        if (data.error) throw new Error(data.error.message);
        return EMPTY;
      })
    );
  }

  private getUserId(): Observable<string> {
    return from(this.supabaseClient.auth.getSession()).pipe(
      map((session) => {
        if (session.data.session) {
          return session.data.session.user.id;
        }
        throw new Error('no session');
      })
    );
  }
}
