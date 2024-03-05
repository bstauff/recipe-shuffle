import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RecipeService } from 'src/app/recipe/recipe.service';

@Component({
  selector: 'app-edit-ingredients',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './edit-ingredients.component.html',
  styleUrl: './edit-ingredients.component.scss',
})
export class EditIngredientsComponent {
  @Input({ required: true })
  recipeKey: string | undefined = '';

  constructor(private recipeService: RecipeService) {}
}
