import { Component, Input, OnInit } from '@angular/core';
import { Recipe } from '../models/recipe';
import { FormBuilder, Validators } from '@angular/forms';
import { Ingredient } from '../models/ingredient';

@Component({
  selector: 'app-add-recipe',
  templateUrl: './add-recipe.component.html',
  styleUrls: ['./add-recipe.component.scss'],
})
export class AddRecipeComponent implements OnInit {
  @Input()
  recipe: Recipe | undefined;

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

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    if (!this.recipe) {
      this.recipe = {
        name: '',
        url: '',
        ingredients: [],
      };
    }
  }

  onSubmit(): void {
    console.log('you submitted the form');

    const newRecipe = this.recipeForm.value as Recipe;

    if (this.recipe) {
      this.recipe.name = newRecipe.name;
      this.recipe.url = newRecipe.url;
    }
    console.log(this.recipe);
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

    this.recipe?.ingredients.push(ingredient);

    this.recipeForm.get('ingredient')?.reset();
  }
}
