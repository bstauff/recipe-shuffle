import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RecipeService } from '../../recipe/recipe.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-recipe-ingredients',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-ingredients.component.html',
  styleUrl: './add-ingredients.component.scss',
})
export class AddRecipeIngredientsComponent {
  @Input()
  recipeKey: string;

  @Output()
  deleteClicked = new EventEmitter<void>();

  ingredientForm = this.formBuilder.group({
    name: this.formBuilder.nonNullable.control('', Validators.required),
    quantity: this.formBuilder.control(null, Validators.required),
  });

  constructor(
    private recipeService: RecipeService,
    private formBuilder: FormBuilder
  ) {
    this.recipeKey = '';
  }
  onSubmit(): void {
    console.log('ingredient form: ', this.ingredientForm);
  }
  onDeleteClicked(): void {
    console.log('delete clicked');
    this.deleteClicked.emit();
  }
}
