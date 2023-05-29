import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'recipe-shuffle';
  isSidenavVisible = false;

  onMenuClicked(): void {
    this.isSidenavVisible = !this.isSidenavVisible;
  }
}
