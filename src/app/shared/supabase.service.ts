import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { EMPTY, Observable, exhaustMap, from, map, of } from 'rxjs';
import { AuthResponse } from './models/AuthResponse';
import { Recipe } from '../recipe/models/recipe';
import { Database } from '../../../lib/database.types';

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
        id,
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
            id: recipe.id,
            name: recipe.name,
            url: recipe.url,
            recipeIngredients: [],
          };
        });
      })
    );
  }

  getRecipe(recipeId: number): Observable<Recipe> {
    const recipe = this.supabaseClient
      .from('recipe')
      .select(
        `
        id,
        name,
        url
      `
      )
      .eq('id', recipeId)
      .single();

    const recipe$ = from(recipe);
    return recipe$.pipe(
      map((response) => {
        if (!response.data) {
          throw new Error(response.error.message);
        }

        return {
          id: response.data?.id,
          name: response.data?.name,
          url: response.data?.url,
          recipeIngredients: [],
        };
      })
    );
  }

  // async upsertRecipeAsync(recipe: Recipe) {
  //   const session = await this.supabaseClient.auth.getSession();

  //   if (!session.data.session) {
  //     throw new Error('no session');
  //   }

  //   const userId = session.data.session.user.id;

  //   const upsertRecipeResponse = await this.supabaseClient
  //     .from('recipe')
  //     .upsert({
  //       recipe_key: recipe.key,
  //       name: recipe.name,
  //       url: recipe.url,
  //       user_id: userId,
  //     })
  //     .select();

  //   if (upsertRecipeResponse.error) {
  //     throw new Error(upsertRecipeResponse.error.message);
  //   }

  //   const ingredientsToUpsert = recipe.recipeIngredients.map(
  //     (x) => x.ingredient
  //   );

  //   const upsertIngredientsResponse = await this.supabaseClient
  //     .from('ingredient')
  //     .upsert(
  //       ingredientsToUpsert.map((x) => {
  //         return {
  //           key: x.key,
  //           name: x.name,
  //           units: x.units,
  //           user_id: userId,
  //         };
  //       })
  //     )
  //     .select();

  //   if (upsertIngredientsResponse.error) {
  //     throw new Error(upsertIngredientsResponse.error.message);
  //   }

  //   const recipeIngredientsToUpsert = recipe.recipeIngredients.map(
  //     (recipeIngredient) => {
  //       return {
  //         ingredient_key: recipeIngredient.ingredient.key,
  //         key: recipeIngredient.key,
  //         quantity: recipeIngredient.quantity,
  //         recipe_key: recipe.key,
  //         user_id: userId,
  //       };
  //     }
  //   );

  //   const upsertRecipeIngredientsResponse = await this.supabaseClient
  //     .from('recipeingredient')
  //     .upsert(recipeIngredientsToUpsert)
  //     .select();

  //   if (upsertRecipeIngredientsResponse.error) {
  //     throw new Error(upsertRecipeIngredientsResponse.error.message);
  //   }

  //   return recipe;
  // }

  // upsertRecipe(recipe: Recipe): Observable<Recipe> {
  //   const upsertRecipe$ = this.upsertRecipeEntity(recipe).pipe(
  //     map((upsertRecipeResponse): Recipe => {
  //       if (upsertRecipeResponse.error) {
  //         throw new Error(upsertRecipeResponse.error.message);
  //       }
  //       return {
  //         key: upsertRecipeResponse.data[0].recipe_key,
  //         name: upsertRecipeResponse.data[0].name,
  //         url: upsertRecipeResponse.data[0].url,
  //         recipeIngredients: [],
  //       };
  //     })
  //   );

  //   const upsertIngredients$ = this.upsertIngredients(
  //     recipe.recipeIngredients.map((x) => x.ingredient)
  //   ).pipe(
  //     map((upsertIngredientsResponse): Ingredient[] => {
  //       if (upsertIngredientsResponse.error) {
  //         throw new Error(upsertIngredientsResponse.error.message);
  //       }
  //       return upsertIngredientsResponse.data.map((supaIngredient) => {
  //         return {
  //           key: supaIngredient.key,
  //           name: supaIngredient.name,
  //           units: supaIngredient.units,
  //         };
  //       });
  //     })
  //   );

  //   const upsertedRecipeIngredients$ = this.upsertRecipeIngredients(
  //     recipe
  //   ).pipe(
  //     map((upsertedRecipeIngredientsResponse) => {
  //       if (upsertedRecipeIngredientsResponse.error) {
  //         throw new Error(upsertedRecipeIngredientsResponse.error.message);
  //       }

  //       return upsertedRecipeIngredientsResponse.data.map((x) => {
  //         return {
  //           key: x.key,
  //           quantity: x.quantity,
  //           ingredient_key: x.ingredient_key,
  //         };
  //       });
  //     })
  //   );
  //   return upsertRecipe$.pipe(
  //     exhaustMap((upsertedRecipe) => {
  //       return upsertIngredients$;
  //     }),
  //     exhaustMap((upsertedIngredients) => {
  //       return upsertedRecipeIngredients$;
  //     }),
  //     exhaustMap((upsertedRecipeIngredients) => {
  //       return of(recipe);
  //     })
  //   );
  // }

  // private upsertRecipeEntity(recipe: Recipe) {
  //   return this.getUserId().pipe(
  //     exhaustMap((userId) => {
  //       return from(
  //         this.supabaseClient
  //           .from('recipe')
  //           .upsert({
  //             recipe_key: recipe.key,
  //             name: recipe.name,
  //             url: recipe.url,
  //             user_id: userId,
  //           })
  //           .select()
  //       );
  //     })
  //   );
  // }
  // private upsertIngredients(ingredients: Ingredient[]) {
  //   return this.getUserId().pipe(
  //     exhaustMap((userId) => {
  //       return from(
  //         this.supabaseClient
  //           .from('ingredient')
  //           .upsert(
  //             ingredients.map((x) => {
  //               return {
  //                 key: x.key,
  //                 name: x.name,
  //                 units: x.units,
  //                 user_id: userId,
  //               };
  //             })
  //           )
  //           .select()
  //       );
  //     })
  //   );
  // }
  // private upsertRecipeIngredients(recipe: Recipe) {
  //   return this.getUserId().pipe(
  //     exhaustMap((userId) => {
  //       const recipeIngredientsToUpsert = recipe.recipeIngredients.map(
  //         (recipeIngredient) => {
  //           return {
  //             ingredient_key: recipeIngredient.ingredient.key,
  //             key: recipeIngredient.key,
  //             quantity: recipeIngredient.quantity,
  //             recipe_key: recipe.key,
  //             user_id: userId,
  //           };
  //         }
  //       );
  //       return from(
  //         this.supabaseClient
  //           .from('recipeingredient')
  //           .upsert(recipeIngredientsToUpsert)
  //           .select()
  //       );
  //     })
  //   );
  // }

  deleteRecipe(recipe: Recipe): Observable<never> {
    return from(
      this.supabaseClient.from('recipe').delete().eq('id', recipe.id)
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
