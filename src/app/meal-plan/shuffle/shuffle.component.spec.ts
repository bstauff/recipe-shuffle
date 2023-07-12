import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

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
      declarations: [ShuffleComponent],
      providers: [{ provide: RecipeService, useValue: recipeServiceSpy }],
    });
    fixture = TestBed.createComponent(ShuffleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should hide shuffle button if users has fewer than 7 recipes', fakeAsync(() => {
    userRecipes$.next([]);
    const componentHtmlElement: HTMLElement = fixture.nativeElement;
    const buttonElement: HTMLButtonElement | null =
      componentHtmlElement.querySelector('button');

    expect(buttonElement).toBeFalsy();
    expect(component.hasEnoughRecipes).toBeFalse();
  }));

  it('should show shuffle button if users has 7 or more recipes', fakeAsync(() => {
    const updatedRecipes: Recipe[] = [];
    for (let i = 0; i < 8; i++) {
      updatedRecipes.push(new Recipe('bananas', ''));
    }
    userRecipes$.next(updatedRecipes);
    tick();
    fixture.detectChanges();
    const componentHtmlElement: HTMLElement = fixture.nativeElement;
    const buttonElement: HTMLButtonElement | null =
      componentHtmlElement.querySelector('button');

    expect(buttonElement).toBeTruthy();
    expect(component.hasEnoughRecipes).toBeTrue();
  }));
});
