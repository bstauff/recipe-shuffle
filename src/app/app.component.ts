import { Component } from '@angular/core';
import { LogoutComponent } from './account/logout/logout.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatNavList, MatListItem } from '@angular/material/list';
import { MatSidenavContainer, MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [
        MatToolbar,
        MatIconButton,
        MatIcon,
        MatSidenavContainer,
        MatSidenav,
        MatNavList,
        MatListItem,
        RouterLink,
        LogoutComponent,
        MatSidenavContent,
        RouterOutlet,
    ],
})
export class AppComponent {
  title = 'recipe-shuffle';
  isSidenavVisible = false;

  onMenuClicked(): void {
    this.isSidenavVisible = !this.isSidenavVisible;
  }
}
