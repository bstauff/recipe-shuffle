import { NgIf } from "@angular/common";
import { Component, inject, type OnDestroy } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButton } from "@angular/material/button";
import { MatError, MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { PasswordMismatchErrorStateMatcher } from "../../register/register.component";
import { passwordsMatchValidator } from "../../register/register.passwords.validator";

@Component({
	selector: "app-password-confirmation",
	templateUrl: "./new-password.component.html",
	styleUrls: ["./new-password.component.scss"],
	imports: [
		ReactiveFormsModule,
		MatFormField,
		MatLabel,
		MatInput,
		NgIf,
		MatError,
		MatButton,
	],
})
export class NewPasswordComponent implements OnDestroy {
	passMismatchErrorStateMatcher = new PasswordMismatchErrorStateMatcher();

	private destroy$ = new Subject();

	private formBuilder = inject(FormBuilder);
	private router = inject(Router);
	private snackBar = inject(MatSnackBar);

	confirmPasswordForm = this.formBuilder.group(
		{
			password: this.formBuilder.control("", [Validators.required]),
			confirmPassword: this.formBuilder.control("", [Validators.required]),
		},
		{ validators: [passwordsMatchValidator] },
	);

	ngOnDestroy(): void {
		this.destroy$.next(true);
		this.destroy$.complete();
	}

	onSubmit(): void {}

	hasPasswordMatchError(): boolean | undefined {
		const passwordControl = this.confirmPasswordForm.get("password");
		const confirmPassControl = this.confirmPasswordForm.get("confirmPassword");

		const hasError =
			passwordControl?.dirty &&
			passwordControl.touched &&
			confirmPassControl?.dirty &&
			confirmPassControl.touched &&
			this.confirmPasswordForm.hasError("passwordsDoNotMatch");

		return hasError;
	}

	notifyUserPasswordUpdated(): void {
		this.snackBar.open("Password updated", "OK");
		this.router.navigate(["/recipes"]);
	}
}
