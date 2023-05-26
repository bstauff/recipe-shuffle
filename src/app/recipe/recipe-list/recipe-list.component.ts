import { Component } from '@angular/core';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../models/recipe';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-recipe-list',
  template: `
    <h1>Recipes</h1>
    <button (click)="onAddClicked()">Add</button>
    <div *ngIf="this.isShowingAdd">
      <app-edit-recipe></app-edit-recipe>
    </div>
    <mat-list>
      <mat-accordion>
        <mat-expansion-panel hideToggle *ngFor="let recipe of recipes | async">
          <mat-expansion-panel-header>
            <mat-panel-title>
              {{ recipe.name }}
            </mat-panel-title>
          </mat-expansion-panel-header>
        </mat-expansion-panel>
      </mat-accordion>
    </mat-list>
  `,
})
export class RecipeListComponent {
  isShowingAdd = false;
  recipes: Observable<Recipe[]> = this.recipeService.recipesChanged;

  constructor(private recipeService: RecipeService) {}

  onAddClicked(): void {
    this.isShowingAdd = !this.isShowingAdd;
  }
}
