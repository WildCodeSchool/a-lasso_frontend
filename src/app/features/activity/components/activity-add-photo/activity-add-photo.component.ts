import { Component, inject, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FormGroup } from '@angular/forms';
import { InputFieldErrorComponent } from '../../../../common/components/input-field-error/input-field-error.component';
import { AssociationFacadeService } from 'src/app/features/association/services/association-facade.service';
import { take, tap } from 'rxjs';
import { Image } from '../../models/activity.model';
import { DialogModule } from 'primeng/dialog';
import { UUIDTypes } from 'uuid';
import { SingleButtonComponent } from '../../../../common/components/single-button/single-button.component';
import { ButtonStyleClass } from 'src/app/common/models/button';
import { TAKE_1 } from 'src/app/common/constants/observables.constants';

type Picture = string | ArrayBuffer;

@Component({
  selector: 'app-activity-add-photo',
  templateUrl: './activity-add-photo.component.html',
  styleUrls: ['./activity-add-photo.component.scss'],
  imports: [InputFieldErrorComponent, DialogModule, SingleButtonComponent],
})
export class ActivityAddPhotoComponent implements OnInit {
  private _associationFacadeService: AssociationFacadeService = inject(AssociationFacadeService);
  private _toast: MessageService = inject(MessageService);

  @Input() formGroup?: FormGroup;

  picturesChosen: Picture[] = ['', '', ''];
  existingImages: Image[] = [];
  ButtonStyleClass = ButtonStyleClass;
  isModalVisible = false;
  modalTargetIndex = 0;
  private _currentOffset = 0;
  private readonly _pageSize = 2;

  ngOnInit(): void {
    this.loadMorePictures();
  }

  openSelectionModal(index: number): void {
    this.modalTargetIndex = index;
    this.isModalVisible = true;
  }

  selectExistingPicture(imageUrl: string, pictureIndex: number, imageId: UUIDTypes): void {
    this.picturesChosen[pictureIndex] = imageUrl;
    this.formGroup.patchValue({
      [`photo_${pictureIndex + 1}`]: {
        id: imageId,
        image: null,
      },
    });
    this.isModalVisible = false;
  }

  removePicture(index: number): void {
    this.picturesChosen[index] = '';
    this.formGroup.patchValue({
      ['photo_' + (index + 1)]: { id: null, image: null },
    });
  }

  loadMorePictures(): void {
    this._associationFacadeService
      .getExistingActivityPictures(this._currentOffset, this._pageSize)
      .pipe(
        tap(images => {
          console.log(images);
          this.existingImages = [...this.existingImages, ...images];
          this._currentOffset += this._pageSize;
        }),
        take(TAKE_1)
      )
      .subscribe();
  }

  triggerFileInput(index: number): void {
    const fileInput = document.getElementById('fileInput' + index) as HTMLElement;
    fileInput.click();
  }

  handleFileInput(event: Event, pictureIndex: number): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      this._toast.add({ severity: 'error', summary: 'Pas de fichier séléctionné' });
      return;
    }

    const maxFileSize = 5 * 1024 * 1024;

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
      const imageData = reader.result;
      this.picturesChosen[pictureIndex] = imageData;
      this.formGroup.patchValue({
        [`photo_${pictureIndex + 1}`]: {
          id: null,
          image: imageData,
        },
      });
      this.isModalVisible = false;
    };
  }
}
