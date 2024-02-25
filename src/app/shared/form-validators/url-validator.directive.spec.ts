import { FormControl, ValidationErrors } from '@angular/forms';
import { badUrlValidator } from './url-validator.directive';

describe('badUrlValidator', () => {
  it('should return null when given good url', () => {
    const url = 'https://www.google.com';
    const urlControl = new FormControl(url);

    const result: ValidationErrors | null = badUrlValidator(urlControl);

    expect(result).toBeNull();
  });

  it('should return null for empty string url', () => {
    const url = '';
    const urlControl = new FormControl(url);

    const result: ValidationErrors | null = badUrlValidator(urlControl);

    expect(result).toBeNull();
  });

  it('should return null for null url', () => {
    const url = null;
    const urlControl = new FormControl(url);

    const result: ValidationErrors | null = badUrlValidator(urlControl);

    expect(result).toBeNull();
  });

  it('should return errors for bad url', () => {
    const url = 'asdfasdf';
    const urlControl = new FormControl(url);

    const result: ValidationErrors | null = badUrlValidator(urlControl);

    expect(result).toBeTruthy();

    const validationError = result as ValidationErrors;

    expect(validationError).toBeTruthy();

    expect(validationError['badUrl']).toBeTruthy();
    expect(validationError['badUrl']['value']).toBe('Url is invalid');
  });
});
