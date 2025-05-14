import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return password === confirm ? null : { passwordsMismatch: true };
}

export function photoRequiredValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isPhotoUploaded = control.value;
    return isPhotoUploaded ? null : { photoRequired: true };
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
