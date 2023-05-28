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
    const recipe: Recipe = {
      name: '',
      url: '',
      ingredients: [],
    };
    const dialogRef = this.dialog.open(EditRecipeComponent, { data: recipe });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
