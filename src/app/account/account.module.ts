import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SharedModule } from '../shared/shared.module';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { NewPasswordComponent } from './password-reset/new-password/new-password.component';
import { LogoutComponent } from './logout/logout.component';

@NgModule({
    imports: [
        CommonModule,
        AccountRoutingModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatInputModule,
        MatButtonModule,
        SharedModule,
        MatSnackBarModule,
        AccountComponent,
        LoginComponent,
        RegisterComponent,
        PasswordResetComponent,
        NewPasswordComponent,
        LogoutComponent,
    ],
    exports: [LogoutComponent],
})
export class AccountModule {}
