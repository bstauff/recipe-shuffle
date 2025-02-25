import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRecipeComponent } from './add-recipe.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarModule,
} from '@angular/material/snack-bar';
import { ErrorDisplayService } from 'src/app/shared/error-display.service';

describe('AddRecipeComponent', () => {
  let component: AddRecipeComponent;
  let fixture: ComponentFixture<AddRecipeComponent>;
  let errorServiceSpy: jasmine.SpyObj<ErrorDisplayService>;

  beforeEach(async () => {
    errorServiceSpy = jasmine.createSpyObj('ErrorDisplayService', [
      'displayError',
    ]);

    await TestBed.configureTestingModule({
      imports: [AddRecipeComponent, BrowserAnimationsModule, MatSnackBarModule],
      providers: [
        { provide: MAT_SNACK_BAR_DATA, useValue: {} },
        { provide: ErrorDisplayService, useValue: errorServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddRecipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
