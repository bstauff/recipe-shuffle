import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RecipeIngredient } from '../models/recipe-ingredient';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-edit-ingredient',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './edit-ingredient.component.html',
  styleUrl: './edit-ingredient.component.scss',
})
export class EditIngredientComponent {
  @Input({ required: true })
  set ingredient(ingredient: RecipeIngredient) {
    console.log('received ingredient', ingredient);
    this._ingredient = ingredient;
  }
  private _ingredient: RecipeIngredient | null = null;

  @Output()
  ingredientDeleted: EventEmitter<void> = new EventEmitter();

  ingredientForm = this.formBuilder.group({
    name: this.formBuilder.control(
      this.ingredient?.ingredientName,
      Validators.required
    ),
    quantity: this.formBuilder.control(
      this.ingredient?.quantity,
      Validators.required
    ),
    units: this.formBuilder.control(
      this.ingredient?.ingredientUnit,
      Validators.required
    ),
  });

  constructor(private formBuilder: FormBuilder) {}

  onDelete(): void {
    this.ingredientDeleted.emit();
  }
}
