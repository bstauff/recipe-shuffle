import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealPlanComponent } from './meal-plan.component';
import { ShuffleComponent } from './shuffle/shuffle.component';
import { RecipeService } from '../recipe/recipe.service';
import { of } from 'rxjs';

describe('MealPlanComponent', () => {
  let component: MealPlanComponent;
  let fixture: ComponentFixture<MealPlanComponent>;
  let recipeService: jasmine.SpyObj<RecipeService>;

  beforeEach(() => {
    recipeService = jasmine.createSpyObj('RecipeService', [], {
      recipesChanged$: of([
        {
          name: 'Test Recipe 1',
          url: 'https://www.bananas.net/',
          ingredients: [],
        },
        {
          name: 'Test Recipe 2',
          url: 'asdf',
          ingredients: [],
        },
      ]),
    });

    TestBed.configureTestingModule({
      declarations: [MealPlanComponent, ShuffleComponent],
      providers: [{ provide: RecipeService, useValue: recipeService }],
    });

    fixture = TestBed.createComponent(MealPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
