import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRecipeComponent } from './edit-recipe.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('EditRecipeComponent', () => {
  let component: EditRecipeComponent;
  let fixture: ComponentFixture<EditRecipeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditRecipeComponent],
      imports: [ReactiveFormsModule],
    });
    fixture = TestBed.createComponent(EditRecipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
