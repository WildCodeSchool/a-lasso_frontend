import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputFieldComponent } from 'src/app/common/components/input-field/input-field.component';
import {
  ADDRESS_NUMBER_REGEX,
  MAX_ADDRESS_LENGTH,
  MAX_LENGTH,
  MIN_LENGTH,
  PASSWORD_REGEX,
  PHONE_REGEX,
  POSTAL_CODE_REGEX,
  SIRET_REGEX,
} from '../../../constants/form.constants';
import { FormField } from '../../../models/form.model';
import { passwordsMatchValidator } from '../../../utils/form.validators';
import { InputFieldErrorComponent } from '../../../../../common/components/input-field-error/input-field-error.component';

@Component({
  selector: 'app-register-association-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputFieldComponent, ButtonModule, InputFieldErrorComponent],
  templateUrl: './register-association-form.component.html',
  styleUrls: ['../styles/register-form.component.scss'],
})
export class RegisterAssociationFormComponent {
  private _fb = inject(FormBuilder);
  @Output() submitted = new EventEmitter<FormGroup>();

  form: FormGroup = this._fb.group(
    {
      siret: ['', [Validators.required, Validators.pattern(SIRET_REGEX)]],
      name: ['', [Validators.required, Validators.minLength(MIN_LENGTH), Validators.maxLength(MAX_LENGTH)]],
      phone: ['', [Validators.pattern(PHONE_REGEX)]],
      addressNumber: ['', [Validators.required, Validators.pattern(ADDRESS_NUMBER_REGEX)]],
      street: ['', [Validators.required, Validators.minLength(MIN_LENGTH), Validators.maxLength(MAX_ADDRESS_LENGTH)]],
      complement: [''],
      zipCode: ['', [Validators.required, Validators.pattern(POSTAL_CODE_REGEX)]],
      city: ['', [Validators.required, Validators.minLength(MIN_LENGTH), Validators.maxLength(MAX_LENGTH)]],
      country: ['', [Validators.required, Validators.minLength(MIN_LENGTH), Validators.maxLength(MAX_LENGTH)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(PASSWORD_REGEX)]],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: [passwordsMatchValidator],
    }
  );

  fields: FormField[] = [
    { name: 'siret', label: 'N° SIRET', type: 'text', required: true },
    { name: 'name', label: 'Nom', type: 'text', required: true },
    { name: 'phone', label: 'Téléphone', type: 'tel', required: true },
  ];

  addressFields: FormField[] = [
    { name: 'addressNumber', label: 'Numéro', type: 'text' },
    { name: 'street', label: 'Rue', type: 'text', required: true },
    { name: 'complement', label: 'Complément', type: 'text' },
    { name: 'zipCode', label: 'Code Postal', type: 'text', required: true },
    { name: 'city', label: 'Ville', type: 'text', required: true },
    { name: 'country', label: 'Pays', type: 'text', required: true },
  ];

  authFields: FormField[] = [
    { name: 'email', label: 'E-mail', type: 'email', required: true },
    { name: 'password', label: 'Mot de passe', type: 'password', required: true, showPasswordRules: true },
    { name: 'confirmPassword', label: 'Confirmation', type: 'password', required: true },
  ];

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.form.value.password === this.form.value.confirmPassword) {
      this.submitted.emit(this.form);
    }
  }

  resetForm(): void {
    this.form.reset();
  }
}
