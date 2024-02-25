import { EMPTY } from 'rxjs';
import { SupabaseService } from '../shared/supabase.service';

describe('RecipeService', () => {
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

  it('should should add recipes', () => {
    expect(false).toBeTrue();
  });
});
