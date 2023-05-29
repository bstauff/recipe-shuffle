import { ComponentFixture, TestBed } from '@angular/core/testing';

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

describe('EditRecipeComponent', () => {
  let component: EditRecipeComponent;
  let fixture: ComponentFixture<EditRecipeComponent>;

  beforeEach(() => {
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
        BrowserAnimationsModule,
      ],
      providers: [
        RecipeService,
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            name: 'Test Recipe',
            url: 'https://test.com',
            ingredients: [
              {
                name: 'Test Ingredient',
                quantity: 1,
              },
            ],
          },
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
});
