import { EMPTY, of, take } from 'rxjs';
import { SupabaseService } from '../shared/supabase.service';
import { RecipeService } from './recipe.service';
import { Recipe } from './models/recipe';
import { Ingredient } from './models/ingredient';

describe('RecipeService', () => {
  let service: RecipeService;
  let supabaseSpy: jasmine.SpyObj<SupabaseService>;

  beforeEach(() => {
    supabaseSpy = jasmine.createSpyObj('SupabaseService', [
      'getRecipes',
      'deleteRecipe',
      'deleteIngredients',
      'upsertRecipe',
    ]);
    supabaseSpy.upsertRecipe.and.returnValue(EMPTY);
    supabaseSpy.deleteRecipe.and.returnValue(EMPTY);
    supabaseSpy.deleteIngredients.and.returnValue(EMPTY);
  });

  it('should call getRecipes when constructed', () => {
    const recipe = new Recipe('test recipe', 'https://bananas.net/');
    const recipes: Recipe[] = [recipe];

    supabaseSpy.getRecipes.and.returnValue(of(recipes));

    service = new RecipeService(supabaseSpy);

    expect(supabaseSpy.getRecipes).toHaveBeenCalled();
  });

  it('should emit recipes on construction', (done) => {
    const recipe = new Recipe('test recipe', 'https://bananas.net/');
    const recipes: Recipe[] = [recipe];

    supabaseSpy.getRecipes.and.returnValue(of(recipes));

    service = new RecipeService(supabaseSpy);

    service.recipesChanged$.pipe(take(1)).subscribe({
      next: (recipes: Recipe[]) => {
        expect(recipes.length).toBe(1);
        done();
      },
    });
  });

  it('should emit new recipes when a recipe is deleted', (done) => {
    const recipe = new Recipe('test recipe', 'https://bananas.net/');
    const recipes: Recipe[] = [recipe];

    supabaseSpy.getRecipes.and.returnValue(of(recipes));

    service = new RecipeService(supabaseSpy);

    service.deleteRecipe(recipe);

    service.recipesChanged$.pipe(take(1)).subscribe({
      next: (recipes: Recipe[]) => {
        expect(recipes.length).toBe(0);
        done();
      },
    });
  });

  it('should delete the correct recipe when deleteRecipe is called', (done) => {
    const recipeA = new Recipe('test recipe', 'https://bananas.net/');
    const recipeB = new Recipe('test recipe', 'https://bananas.net/');
    const recipes: Recipe[] = [recipeA, recipeB];

    supabaseSpy.getRecipes.and.returnValue(of(recipes));

    service = new RecipeService(supabaseSpy);

    service.deleteRecipe(recipeA);

    service.recipesChanged$.pipe(take(1)).subscribe({
      next: (recipes: Recipe[]) => {
        expect(recipes.length).toBe(1);
        expect(recipes[0]).toBe(recipeB);
        done();
      },
    });
  });

  it('should emit updated recipes when deleteIngredients is called', () => {
    const recipeA = new Recipe('test recipe', 'https://bananas.net/');
    const recipeB = new Recipe('test recipe', 'https://bananas.net/');
    const recipes: Recipe[] = [recipeA, recipeB];

    supabaseSpy.getRecipes.and.returnValue(of(recipes));
    service = new RecipeService(supabaseSpy);
    const ingredientA = new Ingredient('ingredientA', 1);

    let recipesEmissions = 0;

    service.recipesChanged$.subscribe({
      next: () => recipesEmissions++,
    });

    service.deleteIngredients([ingredientA]);

    expect(recipesEmissions).toBe(2);
  });

  it('should emit updated recipes when upsertRecipe is called', (done) => {
    const recipe = new Recipe('test recipe', 'https://bananas.net/');
    const recipes: Recipe[] = [recipe];
    const expectedNewName = 'new name';

    supabaseSpy.getRecipes.and.returnValue(of(recipes));

    service = new RecipeService(supabaseSpy);
    service.upsertRecipe({ ...recipe, name: expectedNewName });
    service.recipesChanged$.subscribe({
      next: (recipes) => {
        expect(recipes.length).toBe(1);
        expect(recipes[0].name).toBe(expectedNewName);
        done();
      },
    });
  });
});
