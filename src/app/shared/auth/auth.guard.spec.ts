import { TestBed } from "@angular/core/testing";
import { authGuard } from "./auth.guard";
import { AuthService } from "./auth.service";
import { of } from "rxjs";
import { CanActivateFn } from "@angular/router";

describe("AuthGuard", () => {
	let authServiceMock: jasmine.SpyObj<AuthService> = jasmine.createSpyObj(
		"AuthService",
		["isLoggedIn$"],
		{
			isLoggedIn$: of(false),
		},
	);

	let guard: CanActivateFn;

	beforeEach(() => {
		TestBed.configureTestingModule({ providers: [AuthService] });

		guard = TestBed.inject(authGuard);
	});

	it("should do stuff", () => {
		expect(true).toBe(true);
	});
});
