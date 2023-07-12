import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Recipe } from 'src/app/recipe/models/recipe';
import { RecipeService } from 'src/app/recipe/recipe.service';

@Component({
  selector: 'app-shuffle',
  templateUrl: './shuffle.component.html',
  styleUrls: ['./shuffle.component.scss'],
})
export class ShuffleComponent implements OnInit, OnDestroy {
  hasEnoughRecipes = false;

  recipes: Recipe[] = [];

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
        },
      });
  }
}
