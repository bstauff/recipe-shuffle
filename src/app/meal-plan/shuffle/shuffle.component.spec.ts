import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShuffleComponent } from './shuffle.component';
import { Recipe } from 'src/app/recipe/models/recipe';
import { RecipeService } from 'src/app/recipe/recipe.service';
import { BehaviorSubject } from 'rxjs';

describe('ShuffleComponent', () => {
  let component: ShuffleComponent;
  let fixture: ComponentFixture<ShuffleComponent>;
  let recipeServiceSpy: jasmine.SpyObj<RecipeService>;
  const userRecipes$ = new BehaviorSubject<Recipe[]>([]);

  beforeEach(() => {
    recipeServiceSpy = jasmine.createSpyObj('RecipeService', [], {
      recipesChanged$: userRecipes$.asObservable(),
    });
    TestBed.configureTestingModule({
      imports: [ShuffleComponent],
      providers: [{ provide: RecipeService, useValue: recipeServiceSpy }],
    });
    fixture = TestBed.createComponent(ShuffleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
