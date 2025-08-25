import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/features/authentication/services/auth.service';
import { InputFieldErrorComponent } from '../../../../common/components/input-field-error/input-field-error.component';
import { InputFieldComponent } from '../../../../common/components/input-field/input-field.component';
import { FormField } from '../../../authentication/models/form.model';
import { AssociationLogin, VoluntaryLogin } from '../../../authentication/models/user.model';
import { AuthFacade } from '../../../authentication/services/auth-facade.service';

@Component({
  selector: 'app-email-change-dialog',
  standalone: true,
  imports: [Dialog, ButtonModule, InputTextModule, AvatarModule, InputFieldComponent, InputFieldErrorComponent, ReactiveFormsModule, AsyncPipe],
  templateUrl: './email-change-dialog.component.html',
  styleUrl: './email-change-dialog.component.scss',
})
export class EmailChangeDialogComponent {
  private _authFacade = inject(AuthFacade);
  private _fb: FormBuilder = inject(FormBuilder);
  private _authService = inject(AuthService);

  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() visible = false;

  isVoluntary$: Observable<boolean> = this._authService.isVoluntaryUser();
  userAvatar$: Observable<string | null> = this._authFacade.userAvatar$;
  user$: Observable<VoluntaryLogin | AssociationLogin> = this._authFacade.user$;

  emailForm: FormGroup = this._fb.group({
    newEmail: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  emailFields: FormField[] = [
    { name: 'newEmail', label: 'Nouvelle adresse email', type: 'email' },
    { name: 'password', label: 'Mot de passe', type: 'password' },
  ];

  hide(): void {
    this.emailForm.reset();
    this.visibleChange.emit(false);
  }

  onSubmit(): void {
    if (this.emailForm.valid) {
      const { password, newEmail } = this.emailForm.value;

      this._authFacade.updateEmail(newEmail, password).subscribe(() => {
        this._authFacade.refreshUser();
        this.hide();
      });
    }
  }
}
