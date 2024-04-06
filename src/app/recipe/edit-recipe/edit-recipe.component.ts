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
import { RecipeIngredient } from '../models/recipeingredient';
import { Ingredient } from '../models/ingredient';
import { badUrlValidator } from 'src/app/shared/form-validators/url-validator.directive';

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
      .subscribe({
        next: (recipe) => {
          this.recipe.set(recipe);
          this.recipeForm.patchValue({
            recipeName: recipe.name,
            recipeUrl: recipe.url,
          });
        },
      });
  }

  recipe: WritableSignal<Recipe> = signal(new Recipe('', null));

  ingredientForm = this.formBuilder.group({
    ingredientName: this.formBuilder.control('', Validators.required),
    ingredientQuantity: this.formBuilder.control('', Validators.required),
    ingredientUnits: this.formBuilder.control('', Validators.required),
  });

  recipeForm = this.formBuilder.group({
    recipeName: this.formBuilder.control('', Validators.required),
    recipeUrl: this.formBuilder.control('', badUrlValidator),
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
    if (
      !this.ingredientForm.value.ingredientName ||
      !this.ingredientForm.value.ingredientQuantity ||
      !this.ingredientForm.value.ingredientUnits
    ) {
      throw new Error('bad ingredient form values!');
    }
    const updatedRecipe = { ...this.recipe() };
    updatedRecipe.recipeIngredients.push(
      new RecipeIngredient(
        new Ingredient(
          this.ingredientForm.value.ingredientName,
          this.ingredientForm.value.ingredientUnits
        ),
        Number(this.ingredientForm.value.ingredientQuantity)
      )
    );
    this.recipe.set(updatedRecipe);
    console.log('updated recipe', updatedRecipe);
  }
  onRecipeSave(): void {
    const recipe = this.recipe();

    if (!this.recipeForm.value.recipeName) {
      throw new Error('bad recipe form values!');
    }

    recipe.name = this.recipeForm.value.recipeName;
    recipe.url = this.recipeForm.value.recipeUrl;

    console.log('updated recipe is: ', recipe);

    this.recipeService.upsertRecipe(recipe).subscribe();
  }
}
