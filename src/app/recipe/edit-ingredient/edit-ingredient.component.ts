import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RecipeService } from 'src/app/recipe/recipe.service';
import { Ingredient } from '../models/ingredient';

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
  set ingredient(ingredient: Ingredient) {
    this._ingredient = ingredient;
  }
  private _ingredient: Ingredient | null = null;

  @Output()
  ingredientDeleted: EventEmitter<void> = new EventEmitter();

  ingredientForm = this.formBuilder.group({
    name: this.formBuilder.control(this.ingredient?.name, Validators.required),
    quantity: this.formBuilder.control(
      this.ingredient?.quantity,
      Validators.required
    ),
    units: this.formBuilder.control(
      this.ingredient?.units,
      Validators.required
    ),
  });

  constructor(
    private formBuilder: FormBuilder,
    private recipeService: RecipeService
  ) {}

  onDelete(): void {
    this.ingredientDeleted.emit();
  }

  onSave(): void {
    const ingredientUpdate = {
      name: this.ingredientForm.get('name')?.value as string,
      quantity: this.ingredientForm.get('quantity')?.value as number,
      units: this.ingredientForm.get('units')?.value as string,
      recipeKey: this._ingredient?.recipeKey as string,
      key: this._ingredient?.key as string,
    };

    this.recipeService.upsertIngredient(ingredientUpdate).subscribe({
      next: (ingredient) => console.log('upserted: ', ingredient),
    });
  }
}
