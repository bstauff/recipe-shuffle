import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRecipeComponent } from './add-recipe.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarModule,
} from '@angular/material/snack-bar';
import { ErrorDisplayService } from 'src/app/shared/error-display.service';
import { RecipeService } from '../recipe.service';
import { Subject, of } from 'rxjs';
import { Recipe } from '../models/recipe';

describe('AddRecipeComponent', () => {
  let component: AddRecipeComponent;
  let fixture: ComponentFixture<AddRecipeComponent>;
  let errorServiceSpy: jasmine.SpyObj<ErrorDisplayService>;
  let recipeServiceSpy: jasmine.SpyObj<RecipeService>;

  beforeEach(async () => {
    errorServiceSpy = jasmine.createSpyObj('ErrorDisplayService', [
      'displayError',
    ]);

    recipeServiceSpy = jasmine.createSpyObj('RecipeService', ['addRecipe']);

    recipeServiceSpy.addRecipe.and.returnValue(of());

    await TestBed.configureTestingModule({
      imports: [AddRecipeComponent, BrowserAnimationsModule, MatSnackBarModule],
      providers: [
        { provide: MAT_SNACK_BAR_DATA, useValue: {} },
        { provide: ErrorDisplayService, useValue: errorServiceSpy },
        { provide: RecipeService, useValue: recipeServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddRecipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should require recipe name', () => {
    updateName('');

    expect(component.recipeForm.valid).toBeFalse();
    expect(component.recipeForm.get('name')?.getError('required')).toBeTrue();
  });

  it('should require given url to be valid', () => {
    updateName('Bananas Foster');
    updateUrl('asdfasdf');

    expect(component.recipeForm.valid).toBeFalse();
    expect(component.recipeForm.get('url')?.getError('badUrl')).toBeTruthy();
  });

  it('should be valid with name and no url', () => {
    updateName('bananas foster');

    expect(component.recipeForm.valid).toBeTrue();
  });

  it('should be valid with name and valid url', () => {
    updateName('bananas foster');
    updateUrl('https://bananas.net/');

    expect(component.recipeForm.valid).toBeTrue();
  });

  it('should toggle loading spinner when request is in progress and finishes', () => {
    updateName('bananas foster');

    const recipeSubj = new Subject<Recipe>();

    recipeServiceSpy.addRecipe.and.returnValue(recipeSubj.asObservable());

    component.onSubmit();

    expect(component.isAddRequestInProgress).toBeTrue();

    recipeSubj.next(new Recipe('bananas foster', null));
    expect(component.isAddRequestInProgress).toBeFalse();
  });

  it('should show an error if submit is called with bad name', () => {
    updateName('');

    component.onSubmit();

    expect(errorServiceSpy.displayError).toHaveBeenCalledWith(
      'bad recipe name given'
    );
  });

  it('should show an error if call to recipe service fails', () => {
    const recipeSubj = new Subject<Recipe>();

    recipeServiceSpy.addRecipe.and.returnValue(recipeSubj.asObservable());

    component.onSubmit();

    const expectedError = new Error('recipe add failed');
    recipeSubj.error(expectedError);

    expect(errorServiceSpy.displayError).toHaveBeenCalledWith(
      expectedError.message
    );
    expect(component.isAddRequestInProgress).toBeFalse();
  });

  function updateName(name: string) {
    const recipeForm = component.recipeForm;
    const nameControl = recipeForm.get('name');
    nameControl?.patchValue(name);
  }
  function updateUrl(url: string) {
    const recipeForm = component.recipeForm;
    const urlControl = recipeForm.get('url');
    urlControl?.patchValue(url);
  }
});
