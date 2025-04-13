import { TestBed } from "@angular/core/testing";
import { authGuard } from "./auth.guard";
import { AuthService } from "./auth.service";
import { of } from "rxjs";
import { CanActivateFn } from "@angular/router";
import { SupabaseService } from "../supabase.service";
import { vi } from "vitest";

describe("AuthGuard", () => {
	vi.mock(import("./auth.service"), () => {
		const AuthService = vi.fn();
		AuthService.prototype.$isLoggedIn = vi.fn();
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
			// authGuard(activatedRouteSnapshot, routeStateSnapshot);
		});
		expect(true).toBe(true);
	});
});
