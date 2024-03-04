import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Recipe } from 'src/app/recipe/models/recipe';
import { RecipeService } from 'src/app/recipe/recipe.service';
import { MatCard, MatCardTitle, MatCardSubtitle, MatCardContent } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { NgIf, NgFor } from '@angular/common';

@Component({
    selector: 'app-shuffle',
    templateUrl: './shuffle.component.html',
    styleUrls: ['./shuffle.component.scss'],
    standalone: true,
    imports: [
        NgIf,
        MatButton,
        NgFor,
        MatCard,
        MatCardTitle,
        MatCardSubtitle,
        MatCardContent,
    ],
})
export class ShuffleComponent implements OnInit, OnDestroy {
  hasEnoughRecipes = false;

  private recipes: Recipe[] = [];
  shuffledRecipes: Recipe[] = [];
  mealPlanRecipes: Recipe[] = [];

  private destroy$ = new Subject();
  constructor(private recipeService: RecipeService) {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.recipeService.recipesChanged$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (recipes) => {
          this.hasEnoughRecipes = recipes.length >= 7 ? true : false;
          this.recipes = recipes;
          this.shuffledRecipes = this.recipes.slice();
        },
      });
  }

  onShuffleClicked(): void {
    for (let i = this.shuffledRecipes.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = this.shuffledRecipes[i];
      this.shuffledRecipes[i] = this.shuffledRecipes[j];
      this.shuffledRecipes[j] = temp;
    }
    this.mealPlanRecipes = this.shuffledRecipes.slice(0, 7);
  }

  getDay(dayNumber: number): string {
    switch (dayNumber) {
      case 0:
        return 'Sunday';
      case 1:
        return 'Monday';
      case 2:
        return 'Tuesday';
      case 3:
        return 'Wednesday';
      case 4:
        return 'Thursday';
      case 5:
        return 'Friday';
      case 6:
        return 'Saturday';
      default:
        throw new Error(`no matching day for dayNumber=${dayNumber}`);
    }
  }
}
