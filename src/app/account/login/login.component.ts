import { Component, inject, OnInit } from "@angular/core";
import { FormBuilder, Validators, ReactiveFormsModule } from "@angular/forms";
import { RouterLink, ActivatedRoute, Router } from "@angular/router";
import { MatButton } from "@angular/material/button";
import { MatInput } from "@angular/material/input";
import { MatError, MatFormField, MatLabel } from "@angular/material/form-field";
import { NgIf } from "@angular/common";
import {
	MatCard,
	MatCardActions,
	MatCardContent,
	MatCardFooter,
	MatCardHeader,
	MatCardTitle,
} from "@angular/material/card";
import { AuthService } from "src/app/shared/auth/auth.service";
import { AuthApiError } from "@supabase/supabase-js";

@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.scss"],
	imports: [
		NgIf,
		MatError,
		ReactiveFormsModule,
		MatFormField,
		MatLabel,
		MatInput,
		MatButton,
		MatCard,
		MatCardContent,
		MatCardHeader,
		MatCardTitle,
		MatCardActions,
		MatCardFooter,
		RouterLink,
	],
})
export class LoginComponent implements OnInit {
	loginError = "";
	returnUrl: string = "/recipes";

	private formBuilder = inject(FormBuilder);
	private route = inject(ActivatedRoute);
	private authService = inject(AuthService);
	private router = inject(Router);

	loginForm = this.formBuilder.group({
		email: this.formBuilder.control("", [
			Validators.required,
			Validators.email,
		]),
		password: this.formBuilder.control("", [Validators.required]),
	});

	ngOnInit(): void {
		// Get return url from route parameters or default to '/recipes'
		this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/recipes";
	}

	onSubmit() {
		const { email, password } = this.loginForm.value;

		if (!email || !password) {
			return;
		}

		this.authService.login(email, password).subscribe({
			next: (userId) => {
				console.log(`logged in with userId=${userId}`);
				this.router.navigate(["recipes"]);
			},
			error: (error: AuthApiError) => (this.loginError = error.message),
		});
	}

	emailHasError(): boolean | undefined {
		const emailControl = this.loginForm.get("email");
		return emailControl?.invalid && emailControl?.touched;
	}
	getEmailErrorMessage(): string {
		const emailControl = this.loginForm.get("email");
		if (emailControl?.hasError("required")) {
			return "You must enter a value";
		}
		return emailControl?.hasError("email") ? "Not a valid email" : "";
	}
	passwordHasError(): boolean | undefined {
		const passwordControl = this.loginForm.get("password");
		return passwordControl?.invalid && passwordControl?.touched;
	}
	getPasswordErrorMessage(): string {
		const passwordControl = this.loginForm.get("password");
		if (passwordControl?.hasError("required")) {
			return "You must enter a value";
		}
		return "";
	}
}
