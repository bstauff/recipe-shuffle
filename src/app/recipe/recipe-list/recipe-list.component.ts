import { Component } from '@angular/core';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../models/recipe';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { EditRecipeComponent } from '../edit-recipe/edit-recipe.component';
import { AddRecipeComponent } from '../add-recipe/add-recipe.component';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss'],
})
export class RecipeListComponent {
  isShowingAdd = false;
  recipes: Observable<Recipe[]> = this.recipeService.recipesChanged$;

  constructor(private recipeService: RecipeService, public dialog: MatDialog) {}

  onAddClicked(): void {
    this.dialog.open(AddRecipeComponent);
  }

  getHostname(url: string | null | undefined): string {
    if (!url) return '';
    try {
      const hostname = new URL(url).hostname;
      return hostname.replace('www.', '');
    } catch (_) {
      return '';
    }
  }
  onDelete(): void {
    console.warn('delete not implemented');
  }
  onEdit(recipe: Recipe): void {
    this.dialog.open(EditRecipeComponent, { data: recipe });
  }
}
