import { AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
  const password = group.get('motDePasse')?.value;
  const confirm = group.get('confirmationMotDePasse')?.value;
  return password === confirm ? null : { passwordsMismatch: true };
}
