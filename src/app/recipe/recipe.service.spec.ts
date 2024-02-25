import { of } from 'rxjs';
import { SupabaseService } from '../shared/supabase.service';
import { RecipeService } from './recipe.service';

describe('RecipeService', () => {
  let supabaseSpy: jasmine.SpyObj<SupabaseService>;
  let recipeService: RecipeService;

  const existingRecipe = {
    key: '98755a3e-7c05-4a6a-be02-f42e6532c734',
    name: 'Fruit Salad',
    url: 'https://fruitsalad.net/',
  };

  const existingRecipes = [existingRecipe];

  beforeEach(() => {
    supabaseSpy = jasmine.createSpyObj('SupabaseService', [
      'getRecipes',
      'deleteRecipe',
      'deleteIngredients',
      'upsertRecipe',
    ]);

    supabaseSpy.getRecipes.and.returnValue(of(existingRecipes));
    supabaseSpy.upsertRecipe.and.callFake((givenRecipe) => of(givenRecipe));

    recipeService = new RecipeService(supabaseSpy);
  });

  it('should load recipes on construction', (done) => {
    recipeService.recipesChanged$.subscribe({
      next: (recipes) => {
        expect(recipes.length).toBeGreaterThan(0);
        expect(recipes[0].key).toBe(existingRecipe.key);
        done();
      },
    });
  });

  it('should add new recipes', (done) => {
    const newRecipe = {
      name: 'Potato Salad',
      key: '3ce4a010-1594-44f4-851f-63cff4ec2116',
      url: 'https://potatosalad.net/',
    };

    recipeService.addRecipe(newRecipe).subscribe();

    recipeService.recipesChanged$.subscribe({
      next: (recipes) => {
        expect(recipes.length).toBe(2);
        done();
      },
    });
  });
});
