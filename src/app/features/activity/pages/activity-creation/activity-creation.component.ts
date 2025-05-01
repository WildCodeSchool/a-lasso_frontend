import { Component, inject, OnInit } from '@angular/core';
import { ActivityFilterComponent } from '../../components/activity-filter/activity-filter.component';
import { ThemeName } from '../../models/activity.model';
import { ActivityFacadeService } from '../../services/activity-facade.service';
import { ActivityAddPhotoComponent } from '../../components/activity-add-photo/activity-add-photo.component';

import { InputFieldConfig } from 'src/app/common/models/input.models';
import { SingleButtonComponent } from '../../../../common/components/single-button/single-button.component';
import { MessageService as Toast } from 'primeng/api';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAX_LENGTH } from 'src/app/features/authentication/constants/form.constants';
import { InputFieldComponent } from '../../../../common/components/input-field/input-field.component';
import { MultipleInputFieldComponent } from 'src/app/common/components/multiple-input-field/multiple-input-field.component';

@Component({
  selector: 'app-activity-creation',
  imports: [
    ActivityFilterComponent,
    FormsModule,
    ReactiveFormsModule,
    ActivityAddPhotoComponent,
    MultipleInputFieldComponent,
    SingleButtonComponent,
    InputFieldComponent,
  ],
  templateUrl: './activity-creation.component.html',
  styleUrl: './activity-creation.component.scss',
})
export class ActivityCreationComponent implements OnInit {
  activityFacadeService: ActivityFacadeService = inject(ActivityFacadeService);
  private _fb: FormBuilder = new FormBuilder();
  private _toast: Toast = inject(Toast);
  selectedThemesName: ThemeName[] = [];

  activityForm: FormGroup = this._fb.group({
    title: ['', [Validators.required, Validators.maxLength(MAX_LENGTH)]],
    requieredVoluntary: ['', [Validators.required]],
    date: ['', [Validators.required]],
    hour: ['', [Validators.required]],
    description: ['', [Validators.required, Validators.maxLength(MAX_LENGTH)]],
    photo_1: [null, Validators.required],
    photo_2: [null],
    photo_3: [null],
  });

  activityFields: InputFieldConfig[][] = [
    [{ name: 'title', label: "Titre de l'activité", placeholder: 'Ex : La maraude' }],
    [{ name: 'requieredVoluntary', label: 'Volontaires requis', placeholder: 'Ex : 10' }],
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
    this.activityFacadeService.getActivityThemesFromApi();
  }

  onSubmit(): void {
    console.log(this.activityForm.value);
    this._toast.add({
      severity: 'success',
      summary: 'Activité publié',
    });
  }

  onSelectedThemeChanges(updatedSelectedThemesName: ThemeName[]): void {
    this.selectedThemesName = updatedSelectedThemesName;
  }

  onInputValuesChanged(values: Record<string, string>): void {
    console.log(values);
    // if (value.description) {
    //   {...activityToPublish, description : description}
    // }
  }
}
