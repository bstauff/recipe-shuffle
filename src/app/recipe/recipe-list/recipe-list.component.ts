import { Component } from '@angular/core';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-list',
  template: `
    <h1>Recipes</h1>
    <button (click)="onAddClicked()">Add</button>
    <div *ngIf="this.isShowingAdd">
      <app-edit-recipe></app-edit-recipe>
    </div>
    <ul>
      <li *ngFor="let recipe of recipeService.recipesChanged | async">
        {{ recipe.name }}
      </li>
    </ul>
  `,
})
export class RecipeListComponent {
  isShowingAdd = false;

  constructor(public recipeService: RecipeService) {}

  onAddClicked(): void {
    this.isShowingAdd = !this.isShowingAdd;
  }
}
