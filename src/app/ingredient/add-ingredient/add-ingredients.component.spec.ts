import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRecipeIngredientsComponent } from './add-ingredients.component';

describe('AddRecipeIngredientsComponent', () => {
  let component: AddRecipeIngredientsComponent;
  let fixture: ComponentFixture<AddRecipeIngredientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRecipeIngredientsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddRecipeIngredientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
