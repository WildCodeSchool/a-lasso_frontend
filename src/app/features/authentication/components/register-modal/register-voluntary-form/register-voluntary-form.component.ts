import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputFieldErrorComponent } from '../../../../../common/components/input-field-error/input-field-error.component';
import { InputFieldComponent } from 'src/app/common/components/input-field/input-field.component';
import { MAX_LENGTH, MIN_LENGTH, PASSWORD_REGEX, PHONE_REGEX } from '../../../constants/form.constants';
import { FormField } from '../../../models/form.model';
import { passwordsMatchValidator } from '../../../utils/form.validators';

@Component({
  selector: 'app-register-voluntary-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputFieldComponent, ButtonModule, InputFieldErrorComponent],
  templateUrl: './register-voluntary-form.component.html',
  styleUrls: ['../styles/register-form.component.scss'],
})
export class RegisterVoluntaryFormComponent {
  @Output() submitted = new EventEmitter<FormGroup>();
  private _fb = inject(FormBuilder);
  private _submittedOnce = false;

  form: FormGroup = this._fb.group(
    {
      last_name: ['', [Validators.required, Validators.minLength(MIN_LENGTH), Validators.maxLength(MAX_LENGTH)]],
      first_name: ['', [Validators.required, Validators.minLength(MIN_LENGTH), Validators.maxLength(MAX_LENGTH)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(PASSWORD_REGEX)]],
      confirmPassword: ['', [Validators.required]],
      phone: ['', [Validators.pattern(PHONE_REGEX)]],
      city: ['', [Validators.required, Validators.minLength(MIN_LENGTH), Validators.maxLength(MAX_LENGTH)]],
      country: ['', [Validators.required, Validators.minLength(MIN_LENGTH), Validators.maxLength(MAX_LENGTH)]],
      birthdate: ['', Validators.required],
      cguConsent: [false, Validators.requiredTrue], // ✅ obligatoire
      rgpdConsent: [false, Validators.requiredTrue], // ✅ obligatoire
    },
    {
      validators: [passwordsMatchValidator],
    }
  );

  fields: FormField[] = [
    { name: 'first_name', label: 'Prénom', type: 'text', required: true },
    { name: 'last_name', label: 'Nom', type: 'text', required: true },
    { name: 'email', label: 'E-mail', type: 'email', required: true },
    { name: 'password', label: 'Mot de passe', type: 'password', required: true, showPasswordRules: true },
    { name: 'confirmPassword', label: 'Confirmation', type: 'password', required: true },
    { name: 'phone', label: 'Téléphone', type: 'tel' },
    {
      name: 'coordonnees',
      type: 'group',
      children: [
        { name: 'city', label: 'Ville', type: 'text', required: true },
        { name: 'country', label: 'Pays', type: 'text', required: true },
      ],
    },
    { name: 'birthdate', label: 'Date de naissance', type: 'date', required: true },
  ];

  onSubmit(): void {
    this._submittedOnce = true;

    if (this.form.valid && this.form.value.password === this.form.value.confirmPassword) {
      this.submitted.emit(this.form);
    }
  }

  resetForm(): void {
    this.form.reset();
    this._submittedOnce = false;
  }
}
