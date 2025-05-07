import { Component, inject, OnDestroy, OnInit, Signal } from "@angular/core";
import { Router, RouterLink, RouterOutlet } from "@angular/router";
import { MatNavList, MatListItem } from "@angular/material/list";
import {
	MatSidenavContainer,
	MatSidenav,
	MatSidenavContent,
} from "@angular/material/sidenav";
import { MatIcon } from "@angular/material/icon";
import { MatIconButton } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { MatToolbar } from "@angular/material/toolbar";
import { AuthService } from "./shared/auth/auth.service";
import { Subject, takeUntil } from "rxjs";
import { toSignal } from "@angular/core/rxjs-interop";
import type { UserDetails } from "./shared/auth/models/user-details.model";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
	imports: [
		MatToolbar,
		MatIconButton,
		MatIcon,
		MatSidenavContainer,
		MatSidenav,
		MatMenuModule,
		MatNavList,
		MatListItem,
		RouterLink,
		MatSidenavContent,
		RouterOutlet,
	],
})
export class AppComponent implements OnInit, OnDestroy {
	title = "recipe-shuffle";
	isSidenavVisible = false;

	private readonly authService = inject(AuthService);

	user: Signal<UserDetails | null>;

	private readonly router = inject(Router);

	private readonly destroy$ = new Subject<void>();

	constructor() {
		this.user = toSignal(this.authService.user$, { initialValue: null });
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	ngOnInit(): void {}

	onMenuClicked(): void {
		this.isSidenavVisible = !this.isSidenavVisible;
	}

	onLogoutClicked(): void {
		this.authService
			.logout()
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: () => {
					this.router.navigate(["account", "login"]);
				},
				error: (error) => console.error(error),
			});
	}
}
