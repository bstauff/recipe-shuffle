import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeRoutingModule } from './recipe-routing.module';
import { RecipeService } from './recipe.service';

@NgModule({
  declarations: [RecipeListComponent],
  imports: [CommonModule, RecipeRoutingModule],
  providers: [RecipeService],
})
export class RecipeModule {}
