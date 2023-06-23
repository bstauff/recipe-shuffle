import { AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordsMatchValidator(
  group: AbstractControl
): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;

  console.log('password', password);
  console.log('confirmPassword', confirmPassword);
  console.log('group', group);
  return password === confirmPassword ? null : { passwordsDoNotMatch: true };
}
