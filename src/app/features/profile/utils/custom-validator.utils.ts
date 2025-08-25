import { AbstractControl, ValidationErrors } from '@angular/forms';
import { DATE_REGEX } from 'src/app/features/authentication/constants/form.constants';

export function customDateValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return { required: true };

  if (value instanceof Date) {
    return null;
  }
  if (typeof value === 'string' && DATE_REGEX.test(value)) {
    return null;
  }
  return { pattern: true };
}
