import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { badUrlValidator } from 'src/app/shared/form-validators/url-validator.directive';
import { Recipe } from '../models/recipe';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-add-recipe',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-recipe.component.html',
  styleUrl: './add-recipe.component.scss',
})
export class AddRecipeComponent {
  recipeForm = this.formBuilder.group({
    name: this.formBuilder.nonNullable.control('', Validators.required),
    url: this.formBuilder.control('', badUrlValidator),
  });

  isAddRequestInProgress = false;
  constructor(
    private formBuilder: FormBuilder,
    private recipeService: RecipeService
  ) {}

  onSubmit() {
    if (!this.recipeForm.get('name')?.value) {
      console.error('bad recipe in form');
    }
    const recipeName = this.recipeForm.get('name')?.value as string;
    const recipeUrl = this.recipeForm.get('url')?.value;
    const recipe = new Recipe(recipeName, recipeUrl);
    console.log('adding recipe: ', recipe);
    this.isAddRequestInProgress = true;
    this.recipeService.addRecipe(recipe).subscribe({
      next: (upsertedRecipe: Recipe) => {
        this.isAddRequestInProgress = false;
        console.log('added this recipe to list: ', upsertedRecipe);
      },
    });
  }
}
