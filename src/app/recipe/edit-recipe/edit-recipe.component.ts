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
  updatedIngredients = this.recipe.ingredients.slice();
  deletedIngredients: Ingredient[] = [];

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

    console.log('recipe ingredients before update', this.recipe.ingredients);
    console.log('deleted ingredients', this.deletedIngredients);

    this.recipe.ingredients = this.updatedIngredients.slice();

    console.log('updated recipe ingredients', this.recipe.ingredients);

    this.recipeService.upsertRecipe(this.recipe);
    this.recipeService.deleteIngredients(this.deletedIngredients);

    this.deletedIngredients = [];
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

    const ingredient = new Ingredient(ingredientName, Number(ingredientCount));

    this.updatedIngredients.push(ingredient);

    this.recipeForm.get('ingredient')?.reset();

    this.table?.renderRows();
  }

  onDelete(index: number): void {
    this.updatedIngredients.splice(index, 1);
    this.deletedIngredients.push(this.recipe.ingredients[index]);

    this.table?.renderRows();
  }
}
