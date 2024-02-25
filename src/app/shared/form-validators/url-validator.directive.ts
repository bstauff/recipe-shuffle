import { AbstractControl, ValidationErrors } from '@angular/forms';

export function badUrlValidator(
  control: AbstractControl
): ValidationErrors | null {
  const badUrlError = { badUrl: { value: 'Url is invalid' } };
  if (control.value) {
    try {
      new URL(control.value);
    } catch (error) {
      return badUrlError;
    }
  }
  return null;
}
