import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackbarErrorComponent } from './snackbar-error.component';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

describe('SnackbarErrorComponent', () => {
  let component: SnackbarErrorComponent;
  let fixture: ComponentFixture<SnackbarErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SnackbarErrorComponent],
      providers: [{ provide: MAT_SNACK_BAR_DATA, useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(SnackbarErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
