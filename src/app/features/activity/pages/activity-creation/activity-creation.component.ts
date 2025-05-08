import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivityFilterComponent } from '../../components/activity-filter/activity-filter.component';
import { ActivityFacadeService } from '../../services/activity-facade.service';
import { ActivityAddPhotoComponent } from '../../components/activity-add-photo/activity-add-photo.component';
import { InputFieldConfig } from 'src/app/common/models/input.models';
import { SingleButtonComponent } from '../../../../common/components/single-button/single-button.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  ACTIVITY_DESCRIPTION_MAX_LENGTH,
  HOUR_REGEX,
  MAX_LENGTH,
  MIN_LENGTH,
  NUMBER_REGEX,
  POSTAL_CODE_REGEX,
  DATE_REGEX,
} from 'src/app/features/authentication/constants/form.constants';
import { MultipleInputFieldComponent } from 'src/app/common/components/multiple-input-field/multiple-input-field.component';
import { photoRequiredValidator, themeRequiredValidator } from 'src/app/features/authentication/utils/form.validators';
import { NewActivityCreation } from '../../models/activity-creation.model';

@Component({
  selector: 'app-activity-creation',
  imports: [ActivityFilterComponent, FormsModule, ReactiveFormsModule, ActivityAddPhotoComponent, MultipleInputFieldComponent, SingleButtonComponent],
  templateUrl: './activity-creation.component.html',
  styleUrl: './activity-creation.component.scss',
})
export class ActivityCreationComponent implements OnInit {
  private _activityFacadeService: ActivityFacadeService = inject(ActivityFacadeService);
  private _fb: FormBuilder = new FormBuilder();
  private _destroyRef = inject(DestroyRef);

  formThemeField = 'selectedThemesName';

  activityForm: FormGroup = this._fb.group({
    title: ['', [Validators.required, Validators.maxLength(MAX_LENGTH), Validators.minLength(MIN_LENGTH)]],
    requieredVoluntary: ['', [Validators.required, Validators.pattern(NUMBER_REGEX)]],
    date: ['', [Validators.required, Validators.pattern(DATE_REGEX)]],
    hour: ['', [Validators.required, Validators.pattern(HOUR_REGEX)]],
    zipCode: ['', [Validators.required, Validators.pattern(POSTAL_CODE_REGEX)]],
    city: ['', [Validators.required]],
    selectedThemesName: [[], themeRequiredValidator()],
    description: ['', [Validators.required, Validators.maxLength(ACTIVITY_DESCRIPTION_MAX_LENGTH)]],
    photo_1: [null, photoRequiredValidator()],
    photo_2: [null],
    photo_3: [null],
  });

  activityFields: InputFieldConfig[][] = [
    [{ name: 'title', label: "Titre de l'activité", placeholder: 'Ex : La maraude' }],
    [{ name: 'requestedVolunteers', label: 'Volontaires requis', placeholder: 'Ex : 10' }],
    [{ name: 'date', label: 'Date', placeholder: 'Ex : 26/09/2025', type: 'date' }],
    [{ name: 'hour', label: 'Heure', placeholder: 'Ex : 6h00' }],
    [{ name: 'zipCode', label: 'Code Postal', placeholder: 'Ex : 44000' }],
    [{ name: 'city', label: 'Ville', placeholder: 'Ex : Nantes' }],
  ];

  descriptionFieldConfigs: InputFieldConfig[] = [
    {
      name: 'description',
      label: 'Description',
      placeholder: 'Ex : Participez à des maraudes pour créer du lien social avec les personnes sans-abri... ',
      type: 'textArea',
    },
  ];

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
      associationId: formValue.title,
      images: [formValue.photo_1, formValue.photo_2, formValue.photo_3],
      title: formValue.title,
      requestedVolunteers: formValue.requestedVolunteers,
      date: formValue.date,
      hour: formValue.hour,
      zipCode: formValue.zipCode,
      city: formValue.city,
      themes: formValue.selectedThemesName,
      description: formValue.description,
    };

    this._activityFacadeService.publishNewActivity(data);
  }
}
