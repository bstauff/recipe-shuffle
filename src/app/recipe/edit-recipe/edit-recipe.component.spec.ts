import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { EditRecipeComponent } from './edit-recipe.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RecipeService } from '../recipe.service';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Recipe } from '../models/recipe';
import { Ingredient } from '../models/recipe-ingredient';
import { MatChipsModule } from '@angular/material/chips';

describe('EditRecipeComponent', () => {
  let component: EditRecipeComponent;
  let fixture: ComponentFixture<EditRecipeComponent>;
  let recipe: Recipe;
  let recipeService: jasmine.SpyObj<RecipeService>;

  beforeEach(() => {
    recipe = new Recipe('bananas foster', 'https://bananas.net/');
    recipe.ingredients = [new Ingredient('apples', 5)];
    recipeService = jasmine.createSpyObj('RecipeService', [
      'upsertRecipe',
      'deleteIngredients',
    ]);

    TestBed.configureTestingModule({
      declarations: [EditRecipeComponent],
      imports: [
        CommonModule,
        ReactiveFormsModule,
        MatListModule,
        MatExpansionModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        MatDialogModule,
        MatChipsModule,
        BrowserAnimationsModule,
      ],
      providers: [
        {
          provide: RecipeService,
          useValue: recipeService,
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: recipe,
        },
        {
          provide: MatDialogRef,
          useValue: {},
        },
      ],
    });
    TestBed.inject(RecipeService);
    fixture = TestBed.createComponent(EditRecipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should add ingredient to recipe when onAddIngredient is called', fakeAsync(() => {
    const expectedName = 'bananas';
    const expectedQuantity = 10;

    const ingredientForm = component.recipeForm.get('ingredient');

    const nameControl = ingredientForm?.get('name');
    nameControl?.setValue(expectedName);

    const quantityControl = ingredientForm?.get('quantity');
    quantityControl?.setValue(expectedQuantity.toString());

    component.onAddIngredient();

    component.onSubmit();

    expect(component.recipe.ingredients.length).toBe(2);

    const addedIngredient = component.recipe.ingredients[1];
    expect(addedIngredient.name).toBe(expectedName);
    expect(addedIngredient.quantity).toBe(expectedQuantity);
  }));
  it('should reset ingredient form when onAddIngredient is called', fakeAsync(() => {
    const ingredientForm = component.recipeForm.get('ingredient');

    const nameControl = ingredientForm?.get('name');
    nameControl?.setValue('bananas');

    const quantityControl = ingredientForm?.get('quantity');
    quantityControl?.setValue('10');

    component.onAddIngredient();

    expect(nameControl?.value).toBeNull();
    expect(quantityControl?.value).toBeNull();
  }));
  it('should delete ingredients when onDelete is called', fakeAsync(() => {
    component.onDelete(0);
    component.onSubmit();
    expect(component.recipe.ingredients.length).toBe(0);
  }));
  it('should add tags to recipe when onSubmit is called', fakeAsync(async () => {
    const expectedName = 'Bananas Foster';
    const expectedUrl = 'https://bananas.net/';
    const expectedTag = 'Fruit';

    component.recipeForm.get('name')?.setValue(expectedName);
    component.recipeForm.get('url')?.setValue(expectedUrl);

    component.addTag(expectedTag);

    component.onSubmit();

    tick();
    fixture.detectChanges();

    expect(recipeService.upsertRecipe).toHaveBeenCalledWith(
      jasmine.objectContaining({
        tags: [jasmine.objectContaining({ name: expectedTag })],
      })
    );
  }));

  it('should call upsertRecipe when onSubmit is called', () => {
    component.onSubmit();
    expect(recipeService.upsertRecipe).toHaveBeenCalled();
  });
  it('should call deleteIngredients when onSubmit is called', () => {
    component.onSubmit();
    expect(recipeService.deleteIngredients).toHaveBeenCalled();
  });
  it('should reset form when onSubmit is called', () => {
    component.onSubmit();
    expect(component.recipeForm.pristine).toBeTrue();
  });
  it('should patch form with recipe input on ngOnInit', () => {
    const recipeName = component.recipeForm.get('name')?.value;
    const recipeUrl = component.recipeForm.get('url')?.value;

    expect(recipeName).not.toBeNull();
    expect(recipeName).toBe('bananas foster');

    expect(recipeUrl).not.toBeNull();
    expect(recipeUrl).toBe('https://bananas.net/');

    expect(component.updatedIngredients.length).toBe(1);
    const recipeIngredient = component.updatedIngredients[0];

    expect(recipeIngredient.name).toBe('apples');
    expect(recipeIngredient.quantity).toBe(5);
  });
});
