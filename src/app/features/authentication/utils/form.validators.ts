import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return password === confirm ? null : { passwordsMismatch: true };
}

export function photoRequiredValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    const hasImage = value?.image;
    return hasImage ? null : { photoRequired: true };
  };
}

export function dateRequiredValidator(): ValidatorFn {
  const today = new Date();

  return (control: AbstractControl): ValidationErrors | null => {
    const date = control.value;
    return date && date >= today ? null : { dateRequired: true };
  };
}

export function themeRequiredValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    return Array.isArray(value) && value.length > 0 ? null : { themeRequired: true };
  };
}

export function addressRequiredValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (
      typeof value === 'object' &&
      value !== null &&
      typeof value.display_name === 'string' &&
      typeof value.lat === 'string' &&
      typeof value.lon === 'string'
    ) {
      return null;
    }

    return { invalidAddress: true };
  };
}
