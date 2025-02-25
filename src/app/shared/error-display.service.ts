import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarErrorComponent } from './snackbar-error/snackbar-error.component';

@Injectable({
  providedIn: 'root',
})
export class ErrorDisplayService {
  constructor(private snackbar: MatSnackBar) {}

  displayError(errorMessage: string) {
    this.snackbar.openFromComponent(SnackbarErrorComponent, {
      data: errorMessage,
      duration: 5000,
    });
  }
}
