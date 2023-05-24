import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRecipeComponent } from './edit-recipe.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RecipeService } from '../recipe.service';

describe('EditRecipeComponent', () => {
  let component: EditRecipeComponent;
  let fixture: ComponentFixture<EditRecipeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditRecipeComponent],
      imports: [ReactiveFormsModule],
      providers: [RecipeService],
    });
    TestBed.inject(RecipeService);
    fixture = TestBed.createComponent(EditRecipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
