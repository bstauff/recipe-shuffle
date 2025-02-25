import { TestBed } from '@angular/core/testing';
import { Recipe } from './models/recipe';
import { RecipeService } from './recipe.service';

describe('RecipeService', () => {
  let recipeService: RecipeService;
  let localStorageSpy: jasmine.SpyObj<Storage>;

  beforeEach(() => {
    localStorageSpy = jasmine.createSpyObj('localStorage', ['getItem', 'setItem']);
    spyOn(window.localStorage, 'getItem').and.callFake(localStorageSpy.getItem);
    spyOn(window.localStorage, 'setItem').and.callFake(localStorageSpy.setItem);

    TestBed.configureTestingModule({
      providers: [RecipeService]
    });

    recipeService = TestBed.inject(RecipeService);
  });

  it('should be created', () => {
    expect(recipeService).toBeTruthy();
  });

  it('should load recipes from localStorage on init', () => {
    const mockRecipes: Recipe[] = [
      { id: 1, name: 'Test Recipe 1', url: 'http://test1.com' },
      { id: 2, name: 'Test Recipe 2', url: 'http://test2.com' }
    ];
    localStorageSpy.getItem.and.returnValue(JSON.stringify(mockRecipes));

    recipeService = TestBed.inject(RecipeService);

    recipeService.getRecipes().subscribe(recipes => {
      expect(recipes).toEqual(mockRecipes);
    });
  });

  it('should save recipes to localStorage when upserting', () => {
    const newRecipe: Recipe = { name: 'New Recipe', url: 'http://new.com' };

    recipeService.upsertRecipe(newRecipe).subscribe();

    expect(localStorageSpy.setItem).toHaveBeenCalled();
    const savedRecipes = JSON.parse(localStorageSpy.setItem.calls.mostRecent().args[1]);
    expect(savedRecipes[0].name).toBe(newRecipe.name);
    expect(savedRecipes[0].url).toBe(newRecipe.url);
    expect(savedRecipes[0].id).toBeDefined();
  });

  it('should delete recipe and update localStorage', () => {
    const mockRecipes: Recipe[] = [
      { id: 1, name: 'Test Recipe 1', url: 'http://test1.com' }
    ];
    localStorageSpy.getItem.and.returnValue(JSON.stringify(mockRecipes));
    recipeService = TestBed.inject(RecipeService);

    recipeService.deleteRecipe(1).subscribe();

    expect(localStorageSpy.setItem).toHaveBeenCalled();
    const savedRecipes = JSON.parse(localStorageSpy.setItem.calls.mostRecent().args[1]);
    expect(savedRecipes.length).toBe(0);
  });
});
