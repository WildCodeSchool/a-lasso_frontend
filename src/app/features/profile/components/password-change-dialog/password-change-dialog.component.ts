import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService as Toast } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Observable } from 'rxjs';
import { InputFieldErrorComponent } from 'src/app/common/components/input-field-error/input-field-error.component';
import { InputFieldComponent } from 'src/app/common/components/input-field/input-field.component';
import { showSuccessToast } from 'src/app/common/utils/toast.utils';
import { PASSWORD_REGEX } from 'src/app/features/authentication/constants/form.constants';
import { FormField } from 'src/app/features/authentication/models/form.model';
import { AuthFacade } from 'src/app/features/authentication/services/auth-facade.service';
import { AuthService } from 'src/app/features/authentication/services/auth.service';
import { passwordsMatchValidator } from 'src/app/features/authentication/utils/form.validators';

@Component({
  selector: 'app-password-change-dialog',
  standalone: true,
  imports: [Dialog, ButtonModule, InputTextModule, AvatarModule, InputFieldComponent, InputFieldErrorComponent, ReactiveFormsModule, AsyncPipe],
  templateUrl: './password-change-dialog.component.html',
  styleUrl: './password-change-dialog.component.scss',
})
export class PasswordChangeDialogComponent {
  private _authFacade = inject(AuthFacade);
  private _authService = inject(AuthService);
  private _toast = inject(Toast);
  private _fb: FormBuilder = inject(FormBuilder);

  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() visible = false;

  isVoluntary$: Observable<boolean> = this._authService.isVoluntaryUser();
  user$ = this._authFacade.user$;
  userAvatar$ = this._authFacade.userAvatar$;

  passwordForm: FormGroup = this._fb.group(
    {
      oldPassword: ['', Validators.required],
      password: ['', [Validators.required, Validators.pattern(PASSWORD_REGEX)]],
      confirmPassword: ['', Validators.required],
    },
    {
      validators: [passwordsMatchValidator],
    }
  );

  passwordFields: FormField[] = [
    { name: 'oldPassword', label: 'Ancien mot de passe', type: 'password' },
    { name: 'password', label: 'Nouveau mot de passe', type: 'password' },
    { name: 'confirmPassword', label: 'Confirmer le mot de passe', type: 'password' },
  ];

  hide(): void {
    this.passwordForm.reset();
    this.visibleChange.emit(false);
  }

  onSubmit(): void {
    if (this.passwordForm.valid) {
      const { oldPassword, password } = this.passwordForm.value;

      this._authFacade.changePassword(oldPassword, password).subscribe({
        next: () => {
          showSuccessToast(this._toast);
          this.hide();
        },
      });
    }
  }
}
