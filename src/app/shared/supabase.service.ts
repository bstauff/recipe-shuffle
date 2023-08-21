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
          key,
          name,
          url,
          created_at,
          modified_on,
          recipe_ingredient (
            key,
            name,
            quantity,
            created_at,
            modified_on
          ),
          recipe_tag (
            key,
            name,
            created_at,
            modified_on
          )
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
            key: recipe.key,
            name: recipe.name,
            url: recipe.url,
            ingredients: recipe.recipe_ingredient,
            created_at: recipe.created_at,
            modified_on: recipe.modified_on,
            tags: recipe.recipe_tag,
          };
        });
      })
    );
  }

  upsertRecipe(recipe: Recipe): Observable<never> {
    const userId$ = this.getUserId();
    return userId$.pipe(
      exhaustMap((userId) => {
        return from(
          this.supabaseClient.from('recipe').upsert({
            key: recipe.key,
            name: recipe.name,
            url: recipe.url,
            user_id: userId,
            modified_on: recipe.modified_on,
            created_at: recipe.created_at,
            tag: recipe.tags,
          })
        ).pipe(
          exhaustMap((upsertRecipeResponse) => {
            if (upsertRecipeResponse.error) {
              throw new Error(upsertRecipeResponse.error.message);
            }

            const mapped = recipe.ingredients.map((ingredient) => {
              return {
                ...ingredient,
                recipe_key: recipe.key,
                user_id: userId,
              };
            });

            return from(
              this.supabaseClient.from('recipe_ingredient').upsert(mapped)
            ).pipe(
              exhaustMap((response) => {
                if (response.error) {
                  throw new Error(response.error.message);
                }
                return EMPTY;
              })
            );
          })
        );
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

  deleteIngredients(ingredients: Ingredient[]): Observable<never> {
    return from(
      this.supabaseClient
        .from('recipe_ingredient')
        .delete()
        .in(
          'key',
          ingredients.map((i) => i.key)
        )
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
