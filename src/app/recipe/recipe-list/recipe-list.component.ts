import { Component } from '@angular/core';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../models/recipe';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { EditRecipeComponent } from '../edit-recipe/edit-recipe.component';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss'],
})
export class RecipeListComponent {
  isShowingAdd = false;
  recipes: Observable<Recipe[]> = this.recipeService.recipesChanged;

  constructor(private recipeService: RecipeService, public dialog: MatDialog) {}

  onAddClicked(): void {
    const recipe = new Recipe('', '');
    this.dialog.open(EditRecipeComponent, { data: recipe });
  }

  getHostname(url: string | null): string {
    if (!url) return '';

    const hostname = new URL(url).hostname;
    return hostname.replace('www.', '');
  }
  onDelete(recipe: Recipe): void {
    this.recipeService.deleteRecipe(recipe);
  }
  onEdit(recipe: Recipe): void {
    this.dialog.open(EditRecipeComponent, { data: recipe });
  }
}
