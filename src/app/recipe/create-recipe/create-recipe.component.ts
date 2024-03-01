import { Component } from '@angular/core';
import { AddRecipeComponent } from '../add-recipe/add-recipe.component';
import { timer } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EditIngredientsComponent } from 'src/app/ingredient/edit-ingredients/edit-ingredients.component';

@Component({
  selector: 'app-create-recipe',
  standalone: true,
  imports: [AddRecipeComponent, EditIngredientsComponent],
  templateUrl: './create-recipe.component.html',
  styleUrl: './create-recipe.component.scss',
})
export class CreateRecipeComponent {
  isAddCompleted = false;

  recipeKey = '';

  constructor() {
    timer(3000)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: () => (this.isAddCompleted = true),
      });
  }
}
