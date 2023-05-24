import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeRoutingModule } from './recipe-routing.module';
import { RecipeService } from './recipe.service';
import { EditRecipeComponent } from './edit-recipe/edit-recipe.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [RecipeListComponent, EditRecipeComponent],
  imports: [CommonModule, RecipeRoutingModule, ReactiveFormsModule],
  providers: [RecipeService],
})
export class RecipeModule {}
