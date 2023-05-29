import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Recipe } from '../models/recipe';
import { FormBuilder, Validators } from '@angular/forms';
import { Ingredient } from '../models/ingredient';
import { RecipeService } from '../recipe.service';
import { MatTable } from '@angular/material/table';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-recipe',
  templateUrl: './edit-recipe.component.html',
  styleUrls: ['./edit-recipe.component.scss'],
})
export class EditRecipeComponent implements OnInit {
  @ViewChild(MatTable)
  table: MatTable<Ingredient[]> | undefined;

  displayedColumns: string[] = ['name', 'quantity', 'deleteButton'];
  dataSource = this.recipe.ingredients;

  recipeForm = this.formBuilder.group({
    name: this.formBuilder.control('', { validators: [Validators.required] }),
    url: this.formBuilder.control('', { validators: [Validators.required] }),
    ingredient: this.formBuilder.group({
      name: this.formBuilder.control('', { validators: [Validators.required] }),
      quantity: this.formBuilder.control('', {
        validators: [Validators.required],
      }),
    }),
  });

  constructor(
    private formBuilder: FormBuilder,
    private recipeService: RecipeService,
    @Inject(MAT_DIALOG_DATA) public recipe: Recipe
  ) {}

  ngOnInit(): void {
    this.recipeForm.patchValue(this.recipe);
  }

  onSubmit(): void {
    const updatedRecipe = this.recipeForm.value as Recipe;

    this.recipe.name = updatedRecipe.name;
    this.recipe.url = updatedRecipe.url;

    this.recipeService.upsertRecipe(this.recipe);

    this.recipeForm.reset();
  }

  onAddIngredient(): void {
    if (this.recipeForm.get('ingredient')?.invalid) {
      return;
    }

    const ingredientName = this.recipeForm.value?.ingredient?.name;
    const ingredientCount = this.recipeForm.value?.ingredient?.quantity;

    if (!ingredientName || !ingredientCount) {
      return;
    }

    const ingredient: Ingredient = {
      name: ingredientName,
      quantity: Number(ingredientCount),
    };

    console.log('ingredients in form', this.recipeForm.value?.ingredient);

    this.recipe?.ingredients.push(ingredient);

    this.recipeForm.get('ingredient')?.reset();

    this.table?.renderRows();
  }

  onDelete(index: number): void {
    this.recipe?.ingredients.splice(index, 1);

    this.table?.renderRows();
  }
}
