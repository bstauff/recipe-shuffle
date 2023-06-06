import { Injectable } from '@angular/core';
import { User, createClient } from '@supabase/supabase-js';
import {
  Observable,
  exhaustMap,
  from,
  map,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { AuthResponse } from './models/AuthResponse';
import { Recipe } from '../recipe/models/recipe';
import { Database } from './models/Database';
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

  insertRecipe(recipe: Recipe): Observable<Recipe> {
    return this.getUser().pipe(
      tap((user) => console.log('user', user)),
      exhaustMap((userResponse) => of(userResponse.id)),
      exhaustMap((userId: string) => {
        console.log('im using user id', userId);
        return from(
          this.supabaseClient
            .from('recipe')
            .insert({
              name: recipe.name,
              url: recipe.url,
              user_id: userId,
            })
            .select('id')
        ).pipe(
          exhaustMap((insertResponse) => {
            if (!insertResponse.data) {
              return throwError(() => new Error(insertResponse.error.message));
            }
            return of(insertResponse.data[0]['id'] as number);
          }),
          exhaustMap((recipeId: number) => {
            const ingredients = recipe.ingredients.map((ingredient) => {
              return {
                name: ingredient.name,
                quantity: ingredient.quantity,
                recipe_id: recipeId,
                user_id: userId,
              };
            });
            return from(
              this.supabaseClient
                .from('recipe_ingredient')
                .insert(ingredients)
                .select()
            ).pipe(
              exhaustMap((ingredientInsertResonse) => {
                if (ingredientInsertResonse.error) {
                  return throwError(
                    () => new Error(ingredientInsertResonse.error.message)
                  );
                }
                const ingredients =
                  ingredientInsertResonse.data as Ingredient[];
                if (!ingredients) {
                  return throwError(() => new Error('no ingredients returned'));
                }
                const recipeWithIds: Recipe = {
                  ...recipe,
                  id: recipeId,
                  ingredients: ingredients,
                };
                return of(recipeWithIds);
              })
            );
          })
        );
      })
    );
  }

  private getUser(): Observable<User> {
    return from(this.supabaseClient.auth.getUser()).pipe(
      switchMap((userResponse) => {
        if (!userResponse.data.user) {
          return throwError(() => new Error('user not logged in'));
        }
        return of(userResponse.data.user);
      })
    );
  }

  updateRecipe(
    recipe: Recipe
  ): Observable<{ error: string; isError: boolean }> {
    return from(this.supabaseClient.auth.getUser()).pipe(
      switchMap((user) => {
        if (!user.data.user) {
          return of({ error: 'user not logged in', isError: true });
        }
        return from(
          this.supabaseClient
            .from('recipe')
            .update({
              name: recipe.name,
              url: recipe.url,
              modified_on: new Date().toISOString(),
            })
            .eq('id', recipe.id)
        ).pipe(
          tap((insertResponse) =>
            console.log('insertResponse', insertResponse)
          ),
          switchMap((insertResponse) => {
            if (insertResponse.error) {
              return of({ error: insertResponse.error.message, isError: true });
            }
            return of({ error: '', isError: false });
          })
        );
      })
    );
  }

  getRecipes(): Observable<Recipe[]> {
    return from(this.supabaseClient.from('recipe').select()).pipe(
      tap((response) => console.log('response', response)),
      map((response) => response.data as Recipe[])
    );
  }

  deleteRecipe(
    recipe: Recipe
  ): Observable<{ error: string; isError: boolean }> {
    return from(
      this.supabaseClient.from('recipe').delete().eq('id', recipe.id)
    ).pipe(
      tap((response) => console.log('delete response', response)),
      map((response) => {
        if (response.error) {
          return { error: response.error.message, isError: true };
        }
        return { error: '', isError: false };
      })
    );
  }
}
