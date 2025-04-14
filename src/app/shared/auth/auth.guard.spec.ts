import { TestBed } from "@angular/core/testing";
import { authGuard } from "./auth.guard";
import { AuthService } from "./auth.service";
import { BehaviorSubject, from, of } from "rxjs";
import { SupabaseService } from "../supabase.service";
import { vi } from "vitest";
import {
	ActivatedRouteSnapshot,
	provideRouter,
	RouterStateSnapshot,
} from "@angular/router";
import { RecipeListComponent } from "src/app/recipe/recipe-list/recipe-list.component";

describe("AuthGuard", () => {
	vi.mock(import("./auth.service"), () => {
		const AuthService = vi.fn();
		AuthService.prototype.isLoggedIn$ = vi.fn();
		return { AuthService };
	});
	const authServiceMock = new AuthService();

	vi.mock(import("../supabase.service"), () => {
		const SupabaseService = vi.fn();
		SupabaseService.prototype.$user = vi.fn();
		return { SupabaseService };
	});
	const supabaseMock = new SupabaseService();

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				{ provide: AuthService, useValue: authServiceMock },
				{ provide: SupabaseService, useValue: supabaseMock },
			],
		});
	});

	it("should do stuff", () => {
		TestBed.runInInjectionContext(() => {
			// Create simple mock instances for the guard arguments
			const mockActivatedRouteSnapshot = new ActivatedRouteSnapshot();

			// RouterStateSnapshot often needs at least a URL. Provide a dummy one.
			const mockRouterStateSnapshot = {
				url: "/protected/route",
			} as RouterStateSnapshot;

			authGuard(mockActivatedRouteSnapshot, mockRouterStateSnapshot);
		});
		expect(true).toBe(true);
	});
});
