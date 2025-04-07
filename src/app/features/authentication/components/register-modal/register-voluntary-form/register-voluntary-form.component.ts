import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputFieldErrorComponent } from '../../../../../common/components/input-field-error/input-field-error.component';
import { InputFieldComponent } from 'src/app/common/components/input-field/input-field.component';
import { MAX_LENGTH, MIN_LENGTH, PASSWORD_REGEX, PHONE_REGEX } from '../../../constants/form.constants';
import { FormField } from '../../../models/form.model';
import { passwordsMatchValidator } from '../../../utils/form.utils';

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
  submittedOnce = false;

  form: FormGroup = this._fb.group(
    {
      nom: ['', [Validators.required, Validators.minLength(MIN_LENGTH), Validators.maxLength(MAX_LENGTH)]],
      prenom: ['', [Validators.required, Validators.minLength(MIN_LENGTH), Validators.maxLength(MAX_LENGTH)]],
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', [Validators.required, Validators.pattern(PASSWORD_REGEX)]],
      confirmationMotDePasse: ['', [Validators.required]],
      telephone: ['', [Validators.pattern(PHONE_REGEX)]],
      ville: ['', [Validators.required, Validators.minLength(MIN_LENGTH), Validators.maxLength(MAX_LENGTH)]],
      pays: ['', [Validators.required, Validators.minLength(MIN_LENGTH), Validators.maxLength(MAX_LENGTH)]],
      dateNaissance: ['', Validators.required],
    },
    {
      validators: [passwordsMatchValidator],
    }
  );

  fields: FormField[] = [
    { name: 'prenom', label: 'Prénom', type: 'text', required: true },
    { name: 'nom', label: 'Nom', type: 'text', required: true },
    { name: 'email', label: 'E-mail', type: 'email', required: true },
    { name: 'motDePasse', label: 'Mot de passe', type: 'password', required: true, showPasswordRules: true },
    { name: 'confirmationMotDePasse', label: 'Confirmation', type: 'password', required: true },
    { name: 'telephone', label: 'Téléphone', type: 'tel' },
    {
      name: 'coordonnees',
      type: 'group',
      children: [
        { name: 'ville', label: 'Ville', type: 'text', required: true },
        { name: 'pays', label: 'Pays', type: 'text', required: true },
      ],
    },

    { name: 'dateNaissance', label: 'Date de naissance', type: 'date', required: true },
  ];

  onSubmit(): void {
    this.submittedOnce = true;

    if (this.form.valid && this.form.value.motDePasse === this.form.value.confirmationMotDePasse) {
      this.submitted.emit(this.form);
    }
  }

  resetForm(): void {
    this.form.reset();
    this.submittedOnce = false;
  }
}
