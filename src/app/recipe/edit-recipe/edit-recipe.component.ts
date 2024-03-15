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
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

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
    ReactiveFormsModule,
  ],
  templateUrl: './edit-recipe.component.html',
  styleUrl: './edit-recipe.component.scss',
})
export class EditRecipeComponent {
  @Input({ required: true })
  set recipeKey(recipeKey: string) {
    this.recipeService
      .getRecipe(recipeKey)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ next: (recipe) => this.recipe.set(recipe) });
  }

  recipe: WritableSignal<Recipe> = signal(new Recipe('', null));

  ingredientForm = this.formBuilder.group({
    ingredientName: this.formBuilder.control('', Validators.required),
    ingredientQuantity: this.formBuilder.control('', Validators.required),
    ingredientUnits: this.formBuilder.control('', Validators.required),
  });

  constructor(
    private recipeService: RecipeService,
    private destroyRef: DestroyRef,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  onCancel(): void {
    this.router.navigateByUrl('../');
  }
  onSave(): void {
    console.log('the recipe is: ', this.recipe());
  }
  onAddIngredient(): void {
    console.log('add ingredient');
  }
}
