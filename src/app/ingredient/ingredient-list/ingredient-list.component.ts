import { Component, Input } from '@angular/core';
import { RecipeIngredient } from '../models/recipe-ingredient';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-ingredient-list',
  standalone: true,
  imports: [MatTableModule],
  templateUrl: './ingredient-list.component.html',
  styleUrl: './ingredient-list.component.scss',
})
export class IngredientListComponent {
  @Input({ required: true })
  recipeKey = '';

  recipeIngredients: RecipeIngredient[] = [
    {
      key: 'f019caec-4d7d-4aa8-81e4-19c1c3ba97da',
      ingredientKey: 'f019caec-4d7d-4aa8-81e4-19c1c3ba97da',
      recipeKey: 'f019caec-4d7d-4aa8-81e4-19c1c3ba97da',
      quantity: 5,
      ingredientName: 'Bananas',
      ingredientUnit: 'Bunches',
    },
    {
      key: 'f019caec-4d7d-4aa8-81e4-19c1c3ba97da',
      ingredientKey: 'f019caec-4d7d-4aa8-81e4-19c1c3ba97da',
      recipeKey: 'f019caec-4d7d-4aa8-81e4-19c1c3ba97da',
      quantity: 5,
      ingredientName: 'Ham Hocks',
      ingredientUnit: 'Hock',
    },
    {
      key: 'f019caec-4d7d-4aa8-81e4-19c1c3ba97da',
      ingredientKey: 'f019caec-4d7d-4aa8-81e4-19c1c3ba97da',
      recipeKey: 'f019caec-4d7d-4aa8-81e4-19c1c3ba97da',
      quantity: 5,
      ingredientName: 'Ground Beef',
      ingredientUnit: 'lbs',
    },
  ];

  displayedColumns: string[] = ['name', 'quantity', 'units'];
}
