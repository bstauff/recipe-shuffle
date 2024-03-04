import {
  Component,
  DestroyRef,
  Input,
  WritableSignal,
  signal,
} from '@angular/core';
import { Recipe } from '../models/recipe';
import { MatCardModule } from '@angular/material/card';
import { RecipeService } from '../recipe.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-edit-recipe',
  standalone: true,
  imports: [
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './edit-recipe.component.html',
  styleUrl: './edit-recipe.component.scss',
})
export class EditRecipeComponent {
  @Input()
  set recipeKey(recipeKey: string) {
    this.recipeService
      .getRecipe(recipeKey)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ next: (recipe) => this.recipe.set(recipe) });
  }

  recipe: WritableSignal<Recipe | undefined> = signal(undefined);

  constructor(
    private recipeService: RecipeService,
    private destroyRef: DestroyRef,
    private router: Router
  ) {}

  onCancel(): void {
    this.router.navigateByUrl('../');
  }
}
