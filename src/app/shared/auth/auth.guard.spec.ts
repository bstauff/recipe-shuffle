import { fakeAsync, TestBed } from "@angular/core/testing";
import { authGuard } from "./auth.guard";
import { AuthService } from "./auth.service";
import { SupabaseService } from "../supabase.service";
import { Observable, of } from "rxjs";
import { expect, vi } from "vitest";
import {
	ActivatedRouteSnapshot,
	Router,
	RouterStateSnapshot,
} from "@angular/router";

describe("AuthGuard", () => {
	vi.mock(import("./auth.service"), () => {
		const AuthService = vi.fn();
		AuthService.prototype.user$ = vi.fn();
		return { AuthService };
	});
	let authService: AuthService;

	vi.mock("@angular/router", () => {
		const Router = vi.fn();
		Router.prototype.navigate = vi.fn();

		const ActivatedRouteSnapshot = vi.fn();
		const RouterStateSnapshot = vi.fn();

		return { Router, ActivatedRouteSnapshot, RouterStateSnapshot };
	});
	let router: Router;

	beforeEach(() => {
		authService = new AuthService();
		router = new Router();
		TestBed.configureTestingModule({
			providers: [
				{ provide: AuthService, useValue: authService },
				{ provide: SupabaseService, useValue: SupabaseService },
				{ provide: Router, useValue: router },
			],
		});
	});

	it("should call router navigate when user not logged in", fakeAsync(() => {
		// return false so the router will be called
		vi.spyOn(authService, "user$", "get").mockReturnValue(of(null));

		TestBed.runInInjectionContext(() => {
			// These aren't really used by the guard; they can be anything
			const mockActivatedRouteSnapshot = new ActivatedRouteSnapshot();
			const mockRouterStateSnapshot = {
				url: "/protected/route",
			} as RouterStateSnapshot;

			vi.spyOn(router, "navigate").mockReturnValue(Promise.resolve(true));
			const authGuardFn = authGuard(
				mockActivatedRouteSnapshot,
				mockRouterStateSnapshot,
			);

			const authGuard$ = authGuardFn as Observable<boolean>;
			authGuard$.subscribe({
				next: (wasSuccessful) => {
					expect(wasSuccessful).toBeTruthy();
					expect(router.navigate).toHaveBeenCalled();
				},
			});
		});
	}));

	it("should return true when user is logged in", fakeAsync(() => {
		// return false so the router will be called
		vi.spyOn(authService, "user$", "get").mockReturnValue(
			of("some-cool-user-name"),
		);

		TestBed.runInInjectionContext(() => {
			// These aren't really used by the guard; they can be anything
			const mockActivatedRouteSnapshot = new ActivatedRouteSnapshot();
			const mockRouterStateSnapshot = {
				url: "/protected/route",
			} as RouterStateSnapshot;

			vi.spyOn(router, "navigate").mockReturnValue(Promise.resolve(true));
			const authGuardFn = authGuard(
				mockActivatedRouteSnapshot,
				mockRouterStateSnapshot,
			);

			const authGuard$ = authGuardFn as Observable<boolean>;
			authGuard$.subscribe({
				next: (wasSuccessful) => {
					expect(wasSuccessful).toBeTruthy();
					expect(router.navigate).not.toHaveBeenCalled();
				},
			});
		});
	}));
});
