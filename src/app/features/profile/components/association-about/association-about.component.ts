import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { take } from 'rxjs';
import { MultipleInputFieldComponent } from 'src/app/common/components/multiple-input-field/multiple-input-field.component';
import { TAKE_1 } from 'src/app/common/constants/observables.constants';
import { AssociationFacadeService } from 'src/app/features/association/services/association-facade.service';
import {
  ASSOCIATION_DESCRIPTION_MAX_LENGTH,
  ASSOCIATION_DESCRIPTION_MIN_LENGTH,
  INITIAL_CARDS_COUNT,
  MAX_LENGTH,
  MIN_LENGTH,
} from 'src/app/features/authentication/constants/form.constants';
import { UUIDTypes } from 'uuid';
import { TextareaFieldComponent } from '../../../../common/components/textarea-field/textarea-field.component';
import { AssociationProfileService } from '../../services/association-profil.service';
import { AssociationStatsComponent } from '../association-stats/association-stats.component';
import { customDateValidator } from '../utils/custom-validator.utils';
import { AssociationProfileFacadeService } from '../../services/association-profile-facade.service';
import { UserType } from 'src/app/features/authentication/models/user.model';
import { toApiLocalDateString } from '../utils/date.utils';
import { showSuccessToast } from 'src/app/common/utils/toast.utils';

@Component({
  selector: 'app-association-about',
  standalone: true,
  imports: [MultipleInputFieldComponent, TextareaFieldComponent, AssociationStatsComponent],
  templateUrl: './association-about.component.html',
  styleUrl: './association-about.component.scss',
})
export class AssociationAboutComponent implements OnInit {
  private _fb: FormBuilder = inject(FormBuilder);
  private _associationFacade: AssociationFacadeService = inject(AssociationFacadeService);
  private _profileFacade: AssociationProfileFacadeService = inject(AssociationProfileFacadeService);
  private _profileService: AssociationProfileService = inject(AssociationProfileService);
  private _toast: MessageService = inject(MessageService);
  private _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  cardsCount: number = INITIAL_CARDS_COUNT;
  associationId: UUIDTypes | null = null;

  customFieldConfigs = [
    { name: 'foundationDate', label: 'Date de création', placeholder: 'Ex : 02/04/2025', type: 'date' },
    { name: 'founder', label: 'Créateur', placeholder: 'Ex : Henry Dunant' },
  ];

  descriptionFieldConfig = {
    name: 'description',
    label: 'Description',
    placeholder: 'Ex : Notre association a pour but de...',
    type: 'textarea',
  };

  generalInfoForm: FormGroup = this._fb.group({
    foundationDate: ['', [Validators.required, customDateValidator]],
    founder: ['', [Validators.required, Validators.minLength(MIN_LENGTH), Validators.maxLength(MAX_LENGTH)]],
  });

  descriptionForm: FormGroup = this._fb.group({
    description: [
      '',
      [Validators.required, Validators.minLength(ASSOCIATION_DESCRIPTION_MIN_LENGTH), Validators.maxLength(ASSOCIATION_DESCRIPTION_MAX_LENGTH)],
    ],
  });

  ngOnInit(): void {
    this._loadAssociationId();
    this._populateFormsFromUserInfos();
  }

  onGeneralInfoSave(): void {
    if (this.generalInfoForm.invalid) {
      this.generalInfoForm.markAllAsTouched();
      return;
    }

    if (this.associationId) {
      const fd = this.generalInfoForm.value.foundationDate;
      const payload = {
        foundationDate: toApiLocalDateString(fd),
        founder: this.generalInfoForm.value.founder,
      };

      this._profileService.updateGeneralInfo(this.associationId, payload).subscribe({
        next: () => {
          showSuccessToast(this._toast);
          this._profileFacade.updateGeneralInfo(payload.foundationDate, payload.founder);
        },
      });
    }
  }

  onDescriptionSave(): void {
    if (this.descriptionForm.valid && this.associationId) {
      this._profileService.updateDescription(this.associationId, this.descriptionForm.value.description).subscribe({
        next: () => {
          showSuccessToast(this._toast);
          this._profileFacade.updateDescription(this.descriptionForm.value.description);
        },
      });
    }
  }

  onCardsCountChanged(count: number): void {
    this.cardsCount = count;
    this._cdr.detectChanges();
  }

  private _loadAssociationId(): void {
    this._associationFacade.associationId$.pipe(take(TAKE_1)).subscribe(id => {
      this.associationId = id;
    });
  }

  private _populateFormsFromUserInfos(): void {
    this._profileFacade.userInfos$.pipe(take(TAKE_1)).subscribe(user => {
      if (user?.type === UserType.Association) {
        this.generalInfoForm.patchValue({
          foundationDate: this._formatDateForCalendar(user.foundationDate),
          founder: user.founder ?? '',
        });

        this.descriptionForm.patchValue({
          description: user.description ?? '',
        });
      }
    });
  }

  private _formatDateForCalendar(date: string | Date | null | undefined): Date | null {
    if (!date) return null;
    if (date instanceof Date) return date;
    if (typeof date === 'string') return new Date(date);
    return null;
  }
}
