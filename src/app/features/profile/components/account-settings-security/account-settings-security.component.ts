import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { Observable } from 'rxjs';
import { SingleButtonComponent } from 'src/app/common/components/single-button/single-button.component';
import { ButtonStyleClass } from 'src/app/common/models/button';
import { AssociationLogin, VoluntaryLogin } from 'src/app/features/authentication/models/user.model';
import { AuthFacade } from 'src/app/features/authentication/services/auth-facade.service';
import { EmailChangeDialogComponent } from '../email-change-dialog/email-change-dialog.component';
import { PasswordChangeDialogComponent } from '../password-change-dialog/password-change-dialog.component';
import { showSuccessToast } from 'src/app/common/utils/toast.utils';

@Component({
  selector: 'app-account-settings-security',
  imports: [
    DatePipe,
    CommonModule,
    AsyncPipe,
    SingleButtonComponent,
    PasswordChangeDialogComponent,
    EmailChangeDialogComponent,
    ConfirmDialogModule,
    ToastModule,
  ],
  templateUrl: './account-settings-security.component.html',
  styleUrl: './account-settings-security.component.scss',
})
export class AccountSettingsSecurityComponent {
  private _authFacade = inject(AuthFacade);
  private _confirmation = inject(ConfirmationService);
  private _toast = inject(MessageService);

  user$: Observable<VoluntaryLogin | AssociationLogin | null> = this._authFacade.user$;

  isPasswordDialogVisible = false;
  isEmailDialogVisible = false;
  ButtonStyleClass = ButtonStyleClass;

  onPasswordEdit(): void {
    this.isPasswordDialogVisible = true;
  }

  onEmailEdit(): void {
    this.isEmailDialogVisible = true;
  }

  onDeleteAccount(): void {
    this._confirmation.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.',
      header: 'Confirmation de suppression',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Oui, supprimer',
      rejectLabel: 'Annuler',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      dismissableMask: true,
      accept: () => {
        this._authFacade.deleteAccount().subscribe({
          next: () => {
            showSuccessToast(this._toast);
            this._authFacade.logout();
          },
        });
      },
    });
  }
}
