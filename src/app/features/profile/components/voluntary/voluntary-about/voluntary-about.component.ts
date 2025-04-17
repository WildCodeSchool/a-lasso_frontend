import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { map, Observable, take } from 'rxjs';
import { SingleButtonComponent } from 'src/app/common/components/single-button/single-button.component';
import { TAKE_1 } from 'src/app/common/constants/observables.constants';
import { ButtonStyleClass } from 'src/app/common/models/button';
import { UserType, VoluntaryLogin } from 'src/app/features/authentication/models/user.model';
import { AuthFacade } from 'src/app/features/authentication/services/auth-facade.service';
import { AuthService } from 'src/app/features/authentication/services/auth.service';
import { environment } from 'src/environments/environment.development';
import { VoluntaryUpdateRequestDTO } from '../../../models/update-request-dto.models';
import { VoluntaryProfileService } from '../../../services/voluntary-profil.service';
import { EditableFieldComponent } from '../../editable-field/editable-field.component';
import { UploadAvatarComponent } from '../../upload-avatar/upload-avatar.component';
import { showSuccessToast } from 'src/app/common/utils/toast.utils';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-voluntary-about',
  standalone: true,
  imports: [AsyncPipe, SingleButtonComponent, ReactiveFormsModule, DatePipe, EditableFieldComponent, UploadAvatarComponent],
  templateUrl: './voluntary-about.component.html',
  styleUrl: './voluntary-about.component.scss',
})
export class VoluntaryAboutComponent {
  private _authFacade = inject(AuthFacade);
  private _authService = inject(AuthService);
  private _voluntaryProfileService = inject(VoluntaryProfileService);
  private _fb = inject(FormBuilder);
  private _toast = inject(MessageService);

  apiUrl: string = environment.apiUrl;
  ButtonStyleClass = ButtonStyleClass;

  voluntaryUser$: Observable<VoluntaryLogin | null> = this._authFacade.user$.pipe(
    map(user => (user?.type === UserType.Voluntary ? (user as VoluntaryLogin) : null))
  );
  isVoluntary$: Observable<boolean> = this._authService.isVoluntaryUser();
  userAvatar$: Observable<string | null> = this._authFacade.userAvatar$;

  editMode = false;
  submitted = false;
  profileForm = this._fb.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    birth_date: ['', Validators.required],
    city: ['', Validators.required],
    mobile_phone: [''],
  });
  fields = [
    { name: 'first_name', label: 'Prénom', type: 'text', required: true },
    { name: 'last_name', label: 'Nom', type: 'text', required: true },
    { name: 'birth_date', label: 'Date de naissance', type: 'date', required: true },
    { name: 'mobile_phone', label: 'Téléphone', type: 'text', required: false },
    { name: 'city', label: 'Ville', type: 'text', required: true },
  ];

  setFieldValue(fieldName: string, value: string): void {
    this.profileForm.get(fieldName)?.setValue(value);
  }

  toggleEdit(user: VoluntaryLogin): void {
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.profileForm.patchValue({
        first_name: user.first_name,
        last_name: user.last_name,
        birth_date: user.birth_date,
        city: user.city,
        mobile_phone: user.mobile_phone,
      });
    }
  }

  submitProfile(): void {
    this.submitted = true;
    if (this.profileForm.invalid) return;

    const payload: VoluntaryUpdateRequestDTO = {
      ...this.profileForm.value,
      country: 'France',
    } as VoluntaryUpdateRequestDTO;

    this._voluntaryProfileService
      .updateVoluntaryProfile(payload)
      .pipe(take(TAKE_1))
      .subscribe(() => {
        this._authFacade.refreshUser();
        this.editMode = false;
        showSuccessToast(this._toast);
      });
  }

  closeEditMode(): void {
    this.editMode = false;
    this.submitted = false;
    this.profileForm.reset();
  }
}
