import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { Observable } from 'rxjs';
import { SingleButtonComponent } from '../../../../common/components/single-button/single-button.component';
import { ButtonStyleClass } from '../../../../common/models/button';
import { AssociationLogin, VoluntaryLogin } from '../../../authentication/models/user.model';
import { AuthFacade } from '../../../authentication/services/auth-facade.service';
import { PasswordChangeDialogComponent } from '../password-change-dialog/password-change-dialog.component';
import { showSuccessToast } from 'src/app/common/utils/toast.utils';

@Component({
  selector: 'app-account-settings-security',
  imports: [DatePipe, CommonModule, AsyncPipe, SingleButtonComponent, PasswordChangeDialogComponent, ConfirmDialogModule, ToastModule],
  templateUrl: './account-settings-security.component.html',
  styleUrl: './account-settings-security.component.scss',
})
export class AccountSettingsSecurityComponent {
  private _authFacade = inject(AuthFacade);
  private _confirmation = inject(ConfirmationService);
  private _toast = inject(MessageService);

  user$: Observable<VoluntaryLogin | AssociationLogin | null> = this._authFacade.user$;

  isPasswordDialogVisible = false;
  ButtonStyleClass = ButtonStyleClass;

  onPasswordEdit(): void {
    this.isPasswordDialogVisible = true;
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
