import { RecipeService } from './recipe.service';

describe('RecipeService', () => {
  let service: RecipeService;
  beforeEach(() => {
    service = new RecipeService();
  });

  it('should add recipe if recipe does not exist on upsert', (done: DoneFn) => {
    const recipe = {
      name: 'Test Recipe 3',
      ingredients: [],
      url: '',
    };

    service.upsertRecipe(recipe);

    service.recipesChanged.subscribe((recipes) => {
      expect(recipes).toContain(recipe);
      expect(recipes.length).toBe(1);
      done();
    });
  });

  it('should update recipe if recipe exists on upsert', (done: DoneFn) => {
    const recipe = {
      name: 'Test Recipe 3',
      ingredients: [],
      url: '',
    };

    const expectedUpdateUrl = 'https://bananas.net';

    service.upsertRecipe(recipe);

    service.upsertRecipe({
      ...recipe,
      url: expectedUpdateUrl,
    });

    service.recipesChanged.subscribe((recipes) => {
      expect(recipes.find((rec) => rec.url === expectedUpdateUrl)).toBeTruthy();
      expect(recipes.length).toBe(1);
      done();
    });
  });

  it('should delete recipe', (done: DoneFn) => {
    const recipe = {
      name: 'Test Recipe',
      ingredients: [],
      url: '',
    };

    service.upsertRecipe(recipe);
    service.deleteRecipe(recipe);

    service.recipesChanged.subscribe((recipes) => {
      expect(recipes.length).toBe(0);
      done();
    });
  });
});
