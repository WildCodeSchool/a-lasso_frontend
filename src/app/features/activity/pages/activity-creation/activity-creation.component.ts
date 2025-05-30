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
import { NewActivityCreation } from '../../models/activity-creation.model';
import { SearchAddressComponent } from '../../../../common/components/search-address/search-address.component';
import { ActivityFacadeService } from '../../services/activity-facade.service';
import { InputFieldErrorComponent } from 'src/app/common/components/input-field-error/input-field-error.component';
import { getFormattedAddress } from 'src/app/common/utils/address.utils';

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
  ],

  templateUrl: './activity-creation.component.html',
  styleUrl: './activity-creation.component.scss',
})
export class ActivityCreationComponent implements OnInit {
  private _activityFacadeService: ActivityFacadeService = inject(ActivityFacadeService);
  private _fb: FormBuilder = new FormBuilder();

  formThemeField = 'selectedThemesName';
  descriptionMaxLength = ACTIVITY_DESCRIPTION_MAX_LENGTH;

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
  }

  onSubmit(): void {
    this._triggerValidatorsCheck();
    this._publishActivity();
  }

  private _triggerValidatorsCheck(): void {
    if (this.activityForm.invalid) {
      this.activityForm.markAllAsTouched();
      return;
    }
  }

  private _publishActivity(): void {
    const formValue = this.activityForm.value;

    const data: NewActivityCreation = {
      images: [formValue.photo_1, formValue.photo_2, formValue.photo_3]
        .filter(img => img.id || img.image)
        .map(img => ({
          id: img.id,
          base64: img.image,
        })),
      title: formValue.title,
      requestedVolunteers: formValue.requestedVolunteers,
      dateTime: format(new Date(formValue.date), 'yyyy-MM-dd') + 'T' + formValue.hour + ':00',
      address: getFormattedAddress(formValue.matchedAddress),
      themes: formValue.selectedThemesName,
      description: formValue.description,
    };

    this._activityFacadeService.publishNewActivity(data);
  }
}
