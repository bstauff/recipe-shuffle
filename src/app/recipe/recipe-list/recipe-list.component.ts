import { Component, OnDestroy, OnInit } from '@angular/core';
import { Recipe } from '../models/recipe';
import { RecipeService } from '../recipe.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss'],
})
export class RecipeListComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  recipes: Recipe[] = [];
  isShowingAdd = false;

  constructor(private recipeService: RecipeService) {}
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  ngOnInit(): void {
    const recipeSub = this.recipeService.recipesChanged.subscribe({
      next: (recipes: Recipe[]) => {
        this.recipes = recipes;
      },
    });
    this.subscriptions.push(recipeSub);
  }

  onAddClicked(): void {
    this.isShowingAdd = !this.isShowingAdd;
  }
}
