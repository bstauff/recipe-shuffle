import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeListComponent } from './recipe-list.component';
import { RecipeService } from '../recipe.service';
import { of } from 'rxjs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { RecipeRoutingModule } from '../recipe-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('RecipeListComponent', () => {
  let component: RecipeListComponent;
  let fixture: ComponentFixture<RecipeListComponent>;
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
      imports: [
        BrowserAnimationsModule,
        CommonModule,
        RecipeRoutingModule,
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
      ],
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
      'mat-expansion-panel'
    ) as NodeListOf<HTMLLIElement>;

    expect(recipeListItems.length).toBe(2);
  });
});
