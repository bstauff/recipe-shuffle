import { Component, Input } from '@angular/core';
import { RecipeIngredient } from '../models/recipeingredient';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-edit-recipe-ingredient',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './edit-recipe-ingredient.component.html',
  styleUrl: './edit-recipe-ingredient.component.scss',
})
export class EditRecipeIngredientComponent {
  @Input({ required: true })
  recipeIngredient!: RecipeIngredient;

  recipeIngredientForm = this.formBuilder.group({
    name: this.formBuilder.control('', Validators.required),
    quantity: this.formBuilder.control('', Validators.required),
    units: this.formBuilder.control('', Validators.required),
  });

  constructor(private formBuilder: FormBuilder) {}
}
