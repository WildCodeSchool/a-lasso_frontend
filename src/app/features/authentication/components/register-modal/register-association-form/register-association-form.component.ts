import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputFieldComponent } from 'src/app/common/components/input-field/input-field.component';
import { MAX_LENGTH, MIN_LENGTH, PASSWORD_REGEX, PHONE_REGEX, SIRET_REGEX } from '../../../constants/form.constants';
import { FormField } from '../../../models/form.model';
import { addressRequiredValidator, passwordsMatchValidator } from '../../../utils/form.validators';
import { InputFieldErrorComponent } from '../../../../../common/components/input-field-error/input-field-error.component';
import { SearchAddressComponent } from 'src/app/common/components/search-address/search-address.component';

@Component({
  selector: 'app-register-association-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputFieldComponent, ButtonModule, InputFieldErrorComponent, SearchAddressComponent],
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
      address: ['', addressRequiredValidator()],
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

  addressField: FormField = { name: 'address', label: 'Adresse' };

  authFields: FormField[] = [
    { name: 'email', label: 'E-mail', type: 'email', required: true },
    { name: 'password', label: 'Mot de passe', type: 'password', required: true, showPasswordRules: true },
    { name: 'confirmPassword', label: 'Confirmation', type: 'password', required: true },
  ];

  onSubmit(): void {
    event?.preventDefault();
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
