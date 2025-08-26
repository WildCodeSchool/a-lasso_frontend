import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

import { PASSWORD_REGEX } from '../../constants/form.constants';
import { passwordsMatchValidator } from '../../utils/form.validators';
import { ActivatedRoute } from '@angular/router';
import { AuthFacade } from '../../services/auth-facade.service';
import { InputFieldErrorComponent } from 'src/app/common/components/input-field-error/input-field-error.component';
import { InputFieldComponent } from 'src/app/common/components/input-field/input-field.component';

@Component({
  selector: 'app-reset-password-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputFieldErrorComponent, InputFieldComponent],
  templateUrl: './reset-password-page.component.html',
  styleUrls: ['./reset-password-page.component.scss'],
})
export class ResetPasswordPageComponent {
  private _fb = inject(FormBuilder);
  private _route = inject(ActivatedRoute);
  private _authFacade = inject(AuthFacade);
  private _token: string | null = this._route.snapshot.queryParamMap.get('token');

  resetForm: FormGroup = this._fb.group(
    {
      password: ['', [Validators.required, Validators.pattern(PASSWORD_REGEX)]],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: [passwordsMatchValidator],
    }
  );

  fields = [
    { name: 'password', label: 'Nouveau mot de passe', type: 'password', required: true, showPasswordRules: true },
    { name: 'confirmPassword', label: 'Confirmer le mot de passe', type: 'password', required: true },
  ];

  onSubmit(): void {
    if (!this.resetForm.invalid) {
      const { password } = this.resetForm.value;
      this._authFacade.resetPasswordConfirm(this._token, password);
    }
  }
}
