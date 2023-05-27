import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Recipe } from '../models/recipe';
import { FormBuilder, Validators } from '@angular/forms';
import { Ingredient } from '../models/ingredient';
import { RecipeService } from '../recipe.service';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-edit-recipe',
  templateUrl: './edit-recipe.component.html',
  styleUrls: ['./edit-recipe.component.scss'],
})
export class EditRecipeComponent implements OnInit {
  @Input()
  recipe: Recipe = {
    name: '',
    url: '',
    ingredients: [],
  };
  @Output()
  formCancel = new EventEmitter<void>();

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
    private recipeService: RecipeService
  ) {}

  ngOnInit(): void {
    this.recipeForm.patchValue(this.recipe);
  }

  onSubmit(): void {
    this.recipeService.upsertRecipe(this.recipeForm.value as Recipe);

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

    this.table?.renderRows();
  }

  onFormCancel(): void {
    this.formCancel.emit();
  }

  onDelete(index: number): void {
    this.recipe?.ingredients.splice(index, 1);

    this.table?.renderRows();
  }
}
