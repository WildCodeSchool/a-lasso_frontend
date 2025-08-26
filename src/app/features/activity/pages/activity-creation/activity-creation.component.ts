import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { format } from 'date-fns';
import { InputFieldComponent } from 'src/app/common/components/input-field/input-field.component';
import {
  ACTIVITY_DESCRIPTION_MAX_LENGTH,
  HOUR_REGEX,
  MAX_LENGTH,
  MIN_LENGTH,
  NUMBER_REGEX,
} from 'src/app/features/authentication/constants/form.constants';
import { FormField } from 'src/app/features/authentication/models/form.model';
import { SingleButtonComponent } from '../../../../common/components/single-button/single-button.component';
import { TextareaFieldComponent } from '../../../../common/components/textarea-field/textarea-field.component';
import { ActivityAddPhotoComponent } from '../../components/activity-add-photo/activity-add-photo.component';
import { ActivityFilterComponent } from '../../components/activity-filter/activity-filter.component';
import {
  photoRequiredValidator,
  themeRequiredValidator,
  addressRequiredValidator,
  dateRequiredValidator,
} from 'src/app/features/authentication/utils/form.validators';
import { ActivityStatusEnum, ActivityFormData } from '../../models/activity-creation.model';
import { SearchAddressComponent } from '../../../../common/components/search-address/search-address.component';
import { ActivityFacadeService } from '../../services/activity-facade.service';
import { InputFieldErrorComponent } from 'src/app/common/components/input-field-error/input-field-error.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonStyleClass } from 'src/app/common/models/button';
import { getFormattedAddress } from 'src/app/common/utils/address.utils';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Activity, Localisation } from '../../models/activity.model';
import { Address, AddressApiResult } from 'src/app/features/authentication/models/user.model';
import { allowBodyScroll } from 'src/app/common/utils/style.utils';

export type AddressWithLocation = Address & Localisation;

@Component({
  selector: 'app-activity-creation',
  imports: [
    ActivityFilterComponent,
    FormsModule,
    ReactiveFormsModule,
    ActivityAddPhotoComponent,
    SingleButtonComponent,
    InputFieldComponent,
    InputFieldErrorComponent,
    TextareaFieldComponent,
    SearchAddressComponent,
    AsyncPipe,
  ],

  templateUrl: './activity-creation.component.html',
  styleUrl: './activity-creation.component.scss',
})
export class ActivityCreationComponent implements OnInit {
  private _activityFacadeService: ActivityFacadeService = inject(ActivityFacadeService);
  private _fb: FormBuilder = new FormBuilder();
  private _router: Router = inject(Router);
  private _route: ActivatedRoute = inject(ActivatedRoute);
  private _editedActivityId = this._route.snapshot.paramMap.get('id');
  private _loadedActivityFromDraft: Activity;

  hasLoadedDraft$ = new BehaviorSubject<boolean>(false);

  submitted = false;
  formThemeField = 'selectedThemesName';
  descriptionMaxLength = ACTIVITY_DESCRIPTION_MAX_LENGTH;
  ButtonStyleClass = ButtonStyleClass;

  activityForm: FormGroup = this._fb.group({
    title: ['', [Validators.required, Validators.maxLength(MAX_LENGTH), Validators.minLength(MIN_LENGTH)]],
    requestedVolunteers: ['', [Validators.required, Validators.pattern(NUMBER_REGEX)]],
    date: ['', [dateRequiredValidator()]],
    hour: ['', [Validators.required, Validators.pattern(HOUR_REGEX)]],
    matchedAddress: [null, [addressRequiredValidator()]],
    selectedThemesName: [[], themeRequiredValidator()],
    description: ['', [Validators.required, Validators.maxLength(ACTIVITY_DESCRIPTION_MAX_LENGTH)]],
    photo_1: [{ id: null, image: null }, photoRequiredValidator()],
    photo_2: [{ id: null, image: null }],
    photo_3: [{ id: null, image: null }],
  });

  activityFields: FormField[] = [
    { name: 'title', label: "Titre de l'activité", placeholder: 'Ex : La maraude' },
    { name: 'requestedVolunteers', label: 'Volontaires requis', placeholder: 'Ex : 10' },
    { name: 'date', label: 'Date', placeholder: 'Ex : 26/09/2025', type: 'date' },
    { name: 'hour', label: 'Heure', placeholder: 'Ex : 06:00' },
  ];

  adressFieldConfig: FormField = {
    name: 'matchedAddress',
    label: 'Adresse',
    placeholder: 'Ex : 6 rue de la paix 75002 Paris France',
  };

  descriptionFieldConfigs: FormField = {
    name: 'description',
    label: 'Description',
    placeholder: 'Ex : Participez à des maraudes pour créer du lien social avec les personnes sans-abri... ',
    type: 'textArea',
  };

  ngOnInit(): void {
    this._activityFacadeService.getActivityThemesFromApi();
    this._loadDraftData();
    allowBodyScroll();
  }

  onSubmit(): void {
    this.submitted = true;
    this._triggerValidatorsCheck();
    this._submitActivity(ActivityStatusEnum.PUBLISHED);
  }

  saveNewActivityAsDraft(): void {
    this.submitted = false;
    this._submitActivity(ActivityStatusEnum.DRAFT);
  }
  private _triggerValidatorsCheck(): void {
    if (this.activityForm.invalid) {
      this.activityForm.markAllAsTouched();
    }
  }

  private _submitActivity(status: ActivityStatusEnum): void {
    if (status === ActivityStatusEnum.PUBLISHED && this.activityForm.invalid) {
      this.activityForm.markAllAsTouched();
      return;
    }

    const data: ActivityFormData = this._mapFormToActivityData(status);

    this._activityFacadeService.saveActivity(data).subscribe({
      next: () => {
        this._router.navigate(['/profile/association/activities']);
      },
    });
  }

  private _mapFormToActivityData(status: ActivityStatusEnum): ActivityFormData {
    const formValue = this.activityForm.value;
    const { address, location } = this._getAddressAndLocation(formValue.matchedAddress);

    return {
      id: this._editedActivityId,
      images: [formValue.photo_1, formValue.photo_2, formValue.photo_3]
        .filter(img => img?.id || img?.image)
        .map(img => ({
          id: img.id,
          base64: img.image,
        })),
      title: formValue.title || '',
      requestedVolunteers: Number(formValue.requestedVolunteers) || 0,
      dateTime: formValue.date && formValue.hour ? format(new Date(formValue.date), 'yyyy-MM-dd') + 'T' + formValue.hour + ':00' : '',
      address: address,
      location: location,
      themes: formValue.selectedThemesName,
      description: formValue.description,
      status,
    };
  }

  private _getAddressAndLocation(address: AddressWithLocation | AddressApiResult): { address: Address; location: Localisation } {
    const formattedAddress: Address = this._isAddress(address) ? address : getFormattedAddress(address);
    const isFormattedAddressComplete = Object.values(formattedAddress).every(val => val && val !== '');
    const shouldFallbackToDraftAddress = !isFormattedAddressComplete && status === ActivityStatusEnum.DRAFT && this._editedActivityId;

    return {
      address: shouldFallbackToDraftAddress ? this._loadedActivityFromDraft.address : formattedAddress,
      location: shouldFallbackToDraftAddress
        ? this._loadedActivityFromDraft.location
        : {
            longitude: address?.longitude ? parseFloat(address.longitude as string) : 0,
            latitude: address?.latitude ? parseFloat(address.latitude as string) : 0,
          },
    };
  }

  private _isAddress(address: Address | AddressApiResult | null | undefined): address is Address {
    return (
      !!address &&
      typeof (address as Address).streetName === 'string' &&
      typeof (address as Address).zipCode === 'string' &&
      typeof (address as Address).city === 'string' &&
      typeof (address as Address).country === 'string' &&
      typeof (address as Address).displayName === 'string'
    );
  }

  navigateToHomePage(): void {
    this._router.navigate(['/']);
  }

  private _loadDraftData(): void {
    if (this._editedActivityId) {
      this._activityFacadeService.getActivityFromStore$(this._editedActivityId).subscribe({
        next: (activity: Activity) => {
          const addressAndLocalisation = { ...activity.address, ...activity.location };

          this.activityForm.patchValue({
            title: activity.title,
            requestedVolunteers: activity.participants.max,
            date: activity.date ? new Date(activity.date) : '',
            hour: activity.date ? format(new Date(activity.date), 'HH:mm') : '',
            matchedAddress: addressAndLocalisation || null,
            selectedThemesName: activity.themesName || [],
            description: activity.description,
            photo_1: activity.images[0] || { id: null, image: null },
            photo_2: activity.images[1] || { id: null, image: null },
            photo_3: activity.images[2] || { id: null, image: null },
          });
          this.hasLoadedDraft$.next(true);
          this._loadedActivityFromDraft = activity;
        },
        error: err => {
          console.error('Failed to load activity', err);
        },
      });
    }
  }
}
