import { Component } from '@angular/core';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../models/recipe';
import { Observable, from } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AddRecipeComponent } from '../add-recipe/add-recipe.component';
import { NgFor, AsyncPipe } from '@angular/common';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
  MatExpansionPanelActionRow,
} from '@angular/material/expansion';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatFabButton, MatIconButton } from '@angular/material/button';
import { MatList } from '@angular/material/list';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss'],
  standalone: true,
  imports: [
    MatList,
    MatFabButton,
    MatIcon,
    MatDivider,
    MatAccordion,
    NgFor,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatExpansionPanelActionRow,
    MatIconButton,
    AsyncPipe,
  ],
})
export class RecipeListComponent {
  isShowingAdd = false;
  recipes: Observable<Recipe[]> = this.recipeService.recipesChanged$;

  constructor(
    private recipeService: RecipeService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {}

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
  onEdit(recipeKey: string): void {
    console.log('navigating to edit for recipeKey', recipeKey);
    from(
      this.router.navigate(['edit', recipeKey], { relativeTo: this.route })
    ).subscribe({
      next: (value) => console.log('routing succeeded: ', value),
      error: (error) => console.error('routing failed', error),
    });
  }
}
