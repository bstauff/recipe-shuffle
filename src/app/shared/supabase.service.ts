import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import {
  EMPTY,
  Observable,
  combineLatest,
  exhaustMap,
  from,
  map,
  of,
} from 'rxjs';
import { AuthResponse } from './models/AuthResponse';
import { Recipe } from '../recipe/models/recipe';
import { Database } from '../../../lib/database.types';
import { Ingredient } from '../recipe/models/ingredient';
import { RecipeIngredient } from '../recipe/models/recipeingredient';

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

  async upsertRecipeAsync(recipe: Recipe) {
    const session = await this.supabaseClient.auth.getSession();

    if (!session.data.session) {
      throw new Error('no session');
    }

    const userId = session.data.session.user.id;

    const upsertRecipeResponse = await this.supabaseClient
      .from('recipe')
      .upsert({
        recipe_key: recipe.key,
        name: recipe.name,
        url: recipe.url,
        user_id: userId,
      })
      .select();

    if (upsertRecipeResponse.error) {
      throw new Error(upsertRecipeResponse.error.message);
    }

    const ingredientsToUpsert = recipe.recipeIngredients.map(
      (x) => x.ingredient
    );

    const upsertIngredientsResponse = await this.supabaseClient
      .from('ingredient')
      .upsert(
        ingredientsToUpsert.map((x) => {
          return {
            key: x.key,
            name: x.name,
            units: x.units,
            user_id: userId,
          };
        })
      )
      .select();

    if (upsertIngredientsResponse.error) {
      throw new Error(upsertIngredientsResponse.error.message);
    }

    const recipeIngredientsToUpsert = recipe.recipeIngredients.map(
      (recipeIngredient) => {
        return {
          ingredient_key: recipeIngredient.ingredient.key,
          key: recipeIngredient.key,
          quantity: recipeIngredient.quantity,
          recipe_key: recipe.key,
          user_id: userId,
        };
      }
    );

    const upsertRecipeIngredientsResponse = await this.supabaseClient
      .from('recipeingredient')
      .upsert(recipeIngredientsToUpsert)
      .select();

    if (upsertRecipeIngredientsResponse.error) {
      throw new Error(upsertRecipeIngredientsResponse.error.message);
    }

    return recipe;
  }

  upsertRecipe(recipe: Recipe): Observable<Recipe> {
    const userId$ = this.getUserId();

    const upsertRecipe$ = userId$.pipe(
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
        );
      }),
      map((upsertRecipeResponse): Recipe => {
        if (upsertRecipeResponse.error) {
          throw new Error(upsertRecipeResponse.error.message);
        }
        return {
          key: upsertRecipeResponse.data[0].recipe_key,
          name: upsertRecipeResponse.data[0].name,
          url: upsertRecipeResponse.data[0].url,
          recipeIngredients: [],
        };
      })
    );

    const upsertIngredients$ = userId$.pipe(
      exhaustMap((userId) => {
        return from(
          this.supabaseClient
            .from('ingredient')
            .upsert(
              recipe.recipeIngredients.map((x) => {
                return {
                  key: x.ingredient.key,
                  name: x.ingredient.name,
                  units: x.ingredient.units,
                  user_id: userId,
                };
              })
            )
            .select()
        );
      }),
      map((upsertIngredientsResponse): Ingredient[] => {
        if (upsertIngredientsResponse.error) {
          throw new Error(upsertIngredientsResponse.error.message);
        }
        return upsertIngredientsResponse.data.map((supaIngredient) => {
          return {
            key: supaIngredient.key,
            name: supaIngredient.name,
            units: supaIngredient.units,
          };
        });
      })
    );

    const upsertRecipeIngredients$ = userId$.pipe(
      exhaustMap((userId) => {
        const recipeIngredientsToUpsert = recipe.recipeIngredients.map(
          (recipeIngredient) => {
            return {
              ingredient_key: recipeIngredient.ingredient.key,
              key: recipeIngredient.key,
              quantity: recipeIngredient.quantity,
              recipe_key: recipe.key,
              user_id: userId,
            };
          }
        );
        return from(
          this.supabaseClient
            .from('recipeingredient')
            .upsert(recipeIngredientsToUpsert)
            .select()
        );
      }),
      map((upsertedRecipeIngredientsResponse) => {
        if (upsertedRecipeIngredientsResponse.error) {
          throw new Error(upsertedRecipeIngredientsResponse.error.message);
        }

        return upsertedRecipeIngredientsResponse.data.map((x) => {
          return {
            key: x.key,
            quantity: x.quantity,
            ingredient_key: x.ingredient_key,
          };
        });
      })
    );

    return combineLatest(
      [upsertRecipe$, upsertIngredients$, upsertRecipeIngredients$],
      (upsertedRecipe, upsertedIngredients, upsertedRecipeIngredients) => {
        const ingredientMap = new Map(
          upsertedIngredients.map((x) => [x.key, x])
        );

        const recipeIngredients = upsertedRecipeIngredients.map(
          (recipeIngredient): RecipeIngredient => {
            if (!ingredientMap.has(recipeIngredient.ingredient_key)) {
              throw new Error(
                `no matching ingredient for given ingredient_key in recipeIngredient ${recipeIngredient.key}`
              );
            }
            const ingredient = ingredientMap.get(
              recipeIngredient.ingredient_key
            ) as Ingredient;

            return {
              key: recipeIngredient.key,
              quantity: recipeIngredient.quantity,
              ingredient: {
                key: recipeIngredient.ingredient_key,
                name: ingredient.name,
                units: ingredient.units,
              },
            };
          }
        );

        upsertedRecipe.recipeIngredients = recipeIngredients;
        return upsertedRecipe;
      }
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
