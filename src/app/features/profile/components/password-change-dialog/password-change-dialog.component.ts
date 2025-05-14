import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService as Toast } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { map, Observable } from 'rxjs';
import { InputFieldErrorComponent } from 'src/app/common/components/input-field-error/input-field-error.component';
import { InputFieldComponent } from 'src/app/common/components/input-field/input-field.component';
import { PASSWORD_REGEX } from 'src/app/features/authentication/constants/form.constants';
import { FormField } from 'src/app/features/authentication/models/form.model';
import { UserType } from 'src/app/features/authentication/models/user.model';
import { AuthFacade } from 'src/app/features/authentication/services/auth-facade.service';
import { passwordsMatchValidator } from 'src/app/features/authentication/utils/form.validators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-password-change-dialog',
  standalone: true,
  imports: [Dialog, ButtonModule, AvatarModule, InputFieldComponent, InputFieldErrorComponent, ReactiveFormsModule, AsyncPipe],
  templateUrl: './password-change-dialog.component.html',
  styleUrl: './password-change-dialog.component.scss',
})
export class PasswordChangeDialogComponent {
  private _auth = inject(AuthFacade);
  private _toast = inject(Toast);
  private _fb: FormBuilder = inject(FormBuilder);

  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() visible = false;

  user$ = this._auth.user$;
  userAvatar$: Observable<string | null> = this.user$.pipe(
    map(user => {
      if (!user) return null;
      if (user.type === UserType.Voluntary) {
        return user.avatar.image;
      }
      return user.associationLogoImage.image;
    })
  );

  apiUrl: string = environment.apiUrl;
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

      this._auth.changePassword(oldPassword, password).subscribe({
        next: () => {
          this._toast.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Votre mot de passe a été modifié avec succès.',
          });
          this.hide();
        },
        error: () => {
          this._toast.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Une erreur est survenue lors de la modification de votre mot de passe. Veuillez réessayer.',
          });
        },
      });
    }
  }
}
