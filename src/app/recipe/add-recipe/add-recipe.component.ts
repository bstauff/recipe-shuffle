import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { badUrlValidator } from 'src/app/shared/form-validators/url-validator.directive';
import { RecipeService } from '../recipe.service';
import { ErrorDisplayService } from 'src/app/shared/error-display.service';

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
    private recipeService: RecipeService,
    private errorDisplayService: ErrorDisplayService
  ) {}

  onSubmit() {
    if (!this.recipeForm.get('name')?.value) {
      this.errorDisplayService.displayError('bad recipe name given');
      console.error('null recipe name or value');
    }

    // const recipeName = this.recipeForm.get('name')?.value as string;
    // const recipeUrl = this.recipeForm.get('url')?.value;
    // const recipe = {
    //   id: -1,
    //   name: recipeName,
    //   url: recipeUrl,
    //   recipeIngredients: [],
    // };

    this.isAddRequestInProgress = true;

    // this.recipeService.upsertRecipe(recipe).subscribe({
    //   next: () => {
    //     this.isAddRequestInProgress = false;
    //   },
    //   error: (error: Error) => {
    //     console.error('recipe add failed', error);
    //     this.errorDisplayService.displayError(error.message);
    //     this.isAddRequestInProgress = false;
    //   },
    // });
  }
}
