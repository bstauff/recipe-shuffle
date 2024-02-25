import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Recipe } from '../models/recipe';
import { FormBuilder, Validators } from '@angular/forms';
import { RecipeService } from '../recipe.service';
import { MatTable } from '@angular/material/table';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { RecipeIngredient } from '../models/recipe-ingredient';
import { RecipeTag } from '../models/recipe-tag';

@Component({
  selector: 'app-edit-recipe',
  templateUrl: './edit-recipe.component.html',
  styleUrls: ['./edit-recipe.component.scss'],
})
export class EditRecipeComponent implements OnInit {
  @ViewChild(MatTable)
  table: MatTable<RecipeIngredient[]> | undefined;

  displayedColumns: string[] = ['name', 'quantity', 'deleteButton'];
  updatedIngredients: RecipeIngredient[] = [];
  deletedIngredients: RecipeIngredient[] = [];

  recipeTags: string[] = [];

  readonly separatorKeyCodes = [ENTER, COMMA] as const;
  addOnBlur = true;

  recipeForm = this.formBuilder.group({
    name: this.formBuilder.control('', { validators: [Validators.required] }),
    url: this.formBuilder.control('', { validators: [Validators.required] }),
    tag: this.formBuilder.control('', { validators: [] }),
    ingredient: this.formBuilder.group({
      name: this.formBuilder.control('', { validators: [Validators.required] }),
      quantity: this.formBuilder.control('', {
        validators: [Validators.required],
      }),
      unit: this.formBuilder.control('', { validators: [Validators.required] }),
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

    const updatedTags = this.recipeTags.map((x) => new RecipeTag(x));

    this.deletedIngredients = [];
    this.recipeForm.reset();
  }

  onAddIngredient(): void {
    if (this.recipeForm.get('ingredient')?.invalid) {
      return;
    }

    const name = this.recipeForm.value?.ingredient?.name;
    const count = this.recipeForm.value?.ingredient?.quantity;
    const unit = this.recipeForm.value?.ingredient?.unit;

    if (!name || !count || !unit) {
      return;
    }

    const ingredient = new RecipeIngredient(name, Number(count), unit);

    this.updatedIngredients.push(ingredient);

    this.recipeForm.get('ingredient')?.reset();

    this.table?.renderRows();
  }

  onDelete(index: number): void {
    this.updatedIngredients.splice(index, 1);

    this.table?.renderRows();
  }

  onAddTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    this.addTag(value);

    event.chipInput?.clear();
  }

  addTag(tag: string): void {
    if (tag) {
      this.recipeTags.push(tag);
    }
  }

  editTag(tag: string, event: MatChipEditedEvent) {
    const value = event.value.trim();

    if (!value) {
      this.removeTag(tag);
      return;
    }

    const index = this.recipeTags.indexOf(tag);
    if (index >= 0) {
      this.recipeTags[index] = event.value;
    }
  }

  removeTag(tag: string): void {
    const index = this.recipeTags.indexOf(tag);

    if (index >= 0) {
      this.recipeTags.splice(index, 1);
    }
  }
}
