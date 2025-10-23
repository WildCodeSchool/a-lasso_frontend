import { Component, inject, Input } from '@angular/core';
import { Observable, switchMap, take, tap } from 'rxjs';
import { TAKE_1 } from 'src/app/common/constants/observables.constants';
import { ActivityFacadeService } from 'src/app/features/activity/services/activity-facade.service';
import { AuthFacade } from 'src/app/features/authentication/services/auth-facade.service';
import { AuthService } from 'src/app/features/authentication/services/auth.service';
import { AssociationProfileService } from '../../services/association-profil.service';
import { VoluntaryProfileService } from '../../services/voluntary-profil.service';
import { showErrorToast, showSuccessToast } from 'src/app/common/utils/toast.utils';
import { MessageService } from 'primeng/api';
import { Image } from 'src/app/features/activity/models/activity.model';

type ImageType = 'logo' | 'cover' | 'voluntary';

@Component({
  selector: 'app-upload-avatar',
  templateUrl: './upload-avatar.component.html',
  styleUrls: ['./upload-avatar.component.scss'],
  standalone: true,
})
export class UploadAvatarComponent {
  private _auth = inject(AuthFacade);
  private _authService = inject(AuthService);
  private _activityFacade = inject(ActivityFacadeService);
  private _voluntaryProfileService = inject(VoluntaryProfileService);
  private _associationProfileService = inject(AssociationProfileService);
  private _toast = inject(MessageService);

  @Input() imageUrl: string | null = null;
  @Input() type: ImageType = 'logo';

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const initialFileCount = 0;
    if (!target.files || target.files.length === initialFileCount) return;

    const selectedFileIndex = 0;
    const file = target.files[selectedFileIndex];
    if (!this._isValidFile(file)) return;

    const formData = this._createFormData(file);
    this._authService
      .isVoluntaryUser()
      .pipe(
        take(TAKE_1),
        switchMap(isVoluntary => {
          if (isVoluntary) {
            return this._uploadVoluntaryAvatar(formData);
          }
          return this._uploadAssociationAvatar(formData).pipe(tap(() => this._refreshActivitiesForAssociation()));
        })
      )
      .subscribe(() => {
        this._auth.refreshUser();
        showSuccessToast(this._toast);
      });
  }

  private _isValidFile(file: File): boolean {
    const maxFileSize = 10 * 1024 * 1024;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (file.size > maxFileSize) {
      showErrorToast(this._toast, 'Le fichier est trop volumineux (max 10MB).');
      return false;
    }
    if (!allowedTypes.includes(file.type)) {
      showErrorToast(this._toast, 'Format non autorisé.');
      return false;
    }
    return true;
  }

  private _createFormData(file: File): FormData {
    const formData = new FormData();
    const fieldName = this.type === 'voluntary' ? 'avatar' : this.type === 'logo' ? 'logo' : 'cover';
    formData.append(fieldName, file);
    return formData;
  }

  private _refreshActivitiesForAssociation(): void {
    this._auth.associationId$.pipe(take(TAKE_1)).subscribe(associationId => {
      this._activityFacade.refreshActivitiesByAssociation(associationId);
    });
  }

  private _uploadVoluntaryAvatar(formData: FormData): Observable<Image> {
    return this._voluntaryProfileService.uploadVoluntaryAvatar(formData);
  }

  private _uploadAssociationAvatar(formData: FormData): Observable<Image> {
    if (this.type === 'cover') {
      return this._associationProfileService.uploadAssociationCover(formData);
    }
    return this._associationProfileService.uploadAssociationLogo(formData);
  }
}
