import { Component, inject, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FormGroup } from '@angular/forms';
import { InputFieldErrorComponent } from '../../../../common/components/input-field-error/input-field-error.component';
import { AssociationFacadeService } from 'src/app/features/association/services/association-facade.service';
import { Observable } from 'rxjs';
import { Image } from '../../models/activity.model';

type Picture = string | ArrayBuffer;

@Component({
  selector: 'app-activity-add-photo',
  templateUrl: './activity-add-photo.component.html',
  styleUrls: ['./activity-add-photo.component.scss'],
  imports: [InputFieldErrorComponent],
})
export class ActivityAddPhotoComponent implements OnInit {
  private _associationFacadeService: AssociationFacadeService = inject(AssociationFacadeService);
  private _toast: MessageService = inject(MessageService);

  @Input() formGroup?: FormGroup;

  uploadedPictures: Picture[] = ['', '', ''];
  existingDataBasePictures: Observable<Image[]>;

  ngOnInit(): void {
    this.existingDataBasePictures = this._associationFacadeService.getExistingActivityPictures();
  }

  triggerFileInput(index: number): void {
    const fileInput = document.getElementById('fileInput' + index) as HTMLElement;
    fileInput.click();
    setTimeout(() => {
      const controlName = `photo_${index + 1}`;
      const control = this.formGroup.get(controlName);
      control?.markAsTouched();
      control?.updateValueAndValidity();
    }, 500);
  }

  handleFileInput(event: Event, pictureIndex: number): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      this._toast.add({
        severity: 'error',
        summary: 'Pas de fichier séléctionné',
      });
      return;
    }

    const maxFileSize = 5 * 1024 * 1024; // 5MB limit

    if (file.size > maxFileSize) {
      this._toast.add({
        severity: 'error',
        summary: 'Le fichier est trop volumineux (max 5MB).',
      });
      return;
    }

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = (): void => {
      this.formGroup.patchValue({
        file: reader.result,
      });

      this.uploadedPictures[pictureIndex] = reader.result;

      this.formGroup.patchValue({
        ['photo_' + (pictureIndex + 1)]: reader.result,
      });
    };
  }
}
