import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { RecipeListComponent } from './recipe-list.component';
import { RecipeService } from '../recipe.service';

describe('RecipeListComponent', () => {
  let component: RecipeListComponent;
  let fixture: ComponentFixture<RecipeListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecipeListComponent],
      providers: [RecipeService],
    });
    TestBed.inject(RecipeService);
    fixture = TestBed.createComponent(RecipeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load initial values and render them', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    expect(component.recipes.length).toBe(3);

    const recipeListItems = fixture.nativeElement.querySelectorAll(
      'li'
    ) as NodeListOf<HTMLLIElement>;

    expect(recipeListItems.length).toBe(3);
  }));
});
