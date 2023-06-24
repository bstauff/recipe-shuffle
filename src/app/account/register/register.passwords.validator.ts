import { AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordsMatchValidator(
  group: AbstractControl
): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  if (group.touched && group.dirty) {
    return password === confirmPassword ? null : { passwordsDoNotMatch: true };
  } else {
    return null;
  }
}
