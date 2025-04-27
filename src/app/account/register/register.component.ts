import { Component, inject, OnDestroy, signal } from "@angular/core";
import {
	FormBuilder,
	FormControl,
	Validators,
	ReactiveFormsModule,
} from "@angular/forms";
import { passwordsMatchValidator } from "./register.passwords.validator";
import { ErrorStateMatcher } from "@angular/material/core";
import { MatButton } from "@angular/material/button";
import { NgIf } from "@angular/common";
import { MatInput } from "@angular/material/input";
import { MatFormField, MatLabel, MatError } from "@angular/material/form-field";
import {
	MatCard,
	MatCardActions,
	MatCardContent,
	MatCardHeader,
	MatCardTitle,
} from "@angular/material/card";
import { AuthService } from "src/app/shared/auth/auth.service";
import { UserDetails } from "src/app/shared/auth/models/user-details.model";
import { MatIcon } from "@angular/material/icon";
import { Subject, takeUntil } from "rxjs";

@Component({
	selector: "app-register",
	templateUrl: "./register.component.html",
	styleUrls: ["./register.component.scss"],
	imports: [
		ReactiveFormsModule,
		MatCard,
		MatCardContent,
		MatCardHeader,
		MatCardTitle,
		MatCardActions,
		MatFormField,
		MatIcon,
		MatLabel,
		MatInput,
		NgIf,
		MatError,
		MatButton,
	],
})
export class RegisterComponent implements OnDestroy {
	private formBuilder = inject(FormBuilder);
	private authService = inject(AuthService);
	private destroy$ = new Subject<void>();

	passwordMismatchErrorStateMatcher = new PasswordMismatchErrorStateMatcher();
	registerForm = this.formBuilder.group({
		email: this.formBuilder.control("", [
			Validators.required,
			Validators.email,
		]),
		confirmPassword: this.formBuilder.group(
			{
				password: this.formBuilder.control("", [Validators.required]),
				confirmPassword: this.formBuilder.control("", [Validators.required]),
			},
			{ validators: [passwordsMatchValidator] },
		),
	});

	protected readonly RegistrationState = RegistrationState;

	registrationState = signal<RegistrationState>(RegistrationState.None);
	registeredEmail = signal("");

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	onSubmit() {
		const email = this.registerForm.get("email")?.value;
		const password = this.registerForm.get("confirmPassword.password")?.value;
		const confirmPassword = this.registerForm.get(
			"confirmPassword.confirmPassword",
		)?.value;

		if (!email || !password) return;
		if (password !== confirmPassword) return;

		this.registrationState.set(RegistrationState.Loading);

		this.authService
			.register({ email, password })
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (response) => {
					if (!response) {
						this.registrationFailed();
					} else {
						this.registrationSuccess(response);
					}
				},
				error: () => {
					this.registrationFailed();
				},
			});
	}

	private registrationSuccess(response: UserDetails) {
		this.registrationState.set(RegistrationState.Success);
		this.registeredEmail.set(response.email || "");
	}
	private registrationFailed() {
		this.registrationState.set(RegistrationState.Error);
		this.registerForm.reset();
	}

	hasPasswordMatchError(): boolean | undefined {
		return (
			this.registerForm
				.get("confirmPassword")
				?.hasError("passwordsDoNotMatch") &&
			this.registerForm.get("confirmPassword")?.dirty &&
			this.registerForm.get("confirmPassword")?.touched
		);
	}
}

export class PasswordMismatchErrorStateMatcher extends ErrorStateMatcher {
	override isErrorState(control: FormControl | null): boolean {
		if (control?.dirty && control.touched && control.invalid) {
			return true;
		} else if (
			control?.parent?.dirty &&
			control.parent.touched &&
			control.parent.invalid
		) {
			return true;
		}

		return false;
	}
}

enum RegistrationState {
	Loading = "loading",
	Success = "success",
	Error = "error",
	None = "none",
}
