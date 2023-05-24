import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeListComponent } from './recipe-list.component';
import { RecipeService } from '../recipe.service';
import { of } from 'rxjs';

describe('RecipeListComponent', () => {
  let component: RecipeListComponent;
  let fixture: ComponentFixture<RecipeListComponent>;

  beforeEach(() => {
    const recipeService = jasmine.createSpyObj('RecipeService', [], {
      recipesChanged: of([
        {
          name: 'Test Recipe 1',
          url: '',
          ingredients: [],
        },
        {
          name: 'Test Recipe 2',
          url: '',
          ingredients: [],
        },
      ]),
    });

    TestBed.configureTestingModule({
      declarations: [RecipeListComponent],
      providers: [{ provide: RecipeService, useValue: recipeService }],
    });
    fixture = TestBed.createComponent(RecipeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should load initial values and render them', () => {
    fixture.detectChanges();
    const recipeListItems = fixture.nativeElement.querySelectorAll(
      'li'
    ) as NodeListOf<HTMLLIElement>;

    expect(recipeListItems.length).toBe(2);
  });
});
