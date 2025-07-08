import { Component, inject, Input, OnInit } from '@angular/core';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { MessageService } from 'primeng/api';
import { FormGroup } from '@angular/forms';
import { InputFieldErrorComponent } from '../../../../common/components/input-field-error/input-field-error.component';
import { AssociationFacadeService } from 'src/app/features/association/services/association-facade.service';
import { map, Observable, of, switchMap } from 'rxjs';
import { Image } from '../../models/activity.model';
import { DialogModule } from 'primeng/dialog';
import { UUIDTypes } from 'uuid';
import { SingleButtonComponent } from '../../../../common/components/single-button/single-button.component';
import { ButtonStyleClass } from 'src/app/common/models/button';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-activity-add-photo',
  templateUrl: './activity-add-photo.component.html',
  styleUrls: ['./activity-add-photo.component.scss'],
  imports: [InputFieldErrorComponent, DialogModule, SingleButtonComponent, ImageCropperComponent, AsyncPipe],
})
export class ActivityAddPhotoComponent implements OnInit {
  private _associationFacadeService: AssociationFacadeService = inject(AssociationFacadeService);
  private _toast: MessageService = inject(MessageService);

  @Input() formGroup?: FormGroup;

  existingImages$: Observable<Image[]> = of([]);
  picturesChosen: string[] = ['', '', ''];
  ButtonStyleClass = ButtonStyleClass;
  isModalVisible = false;
  modalTargetIndex = 0;

  croppedImage: string = null;
  imageChangedEvent: Event | null = null;
  isCropperVisible = false;
  currentPictureIndex = 0;

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
    const nextPageImage$: Observable<Image[]> = this._associationFacadeService.getExistingActivityPictures(this._currentOffset, this._pageSize);
    this.existingImages$ = this.existingImages$.pipe(
      switchMap((currentImages: Image[]) =>
        nextPageImage$.pipe(
          map((newImages: Image[]) => {
            this._currentOffset += this._pageSize;
            return [...currentImages, ...newImages];
          })
        )
      )
    );
  }

  triggerFileInput(index: number): void {
    const fileInput = document.getElementById('fileInput' + index) as HTMLElement;
    fileInput.click();
  }

  handleFileInput(event: Event, pictureIndex: number): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      this._toast.add({ severity: 'error', summary: 'Pas de fichier sélectionné' });
      return;
    }

    const maxFileSize = 5 * 1024 * 1024;
    if (file.size > maxFileSize) {
      this._toast.add({ severity: 'error', summary: 'Le fichier est trop volumineux (max 5MB).' });
      return;
    }

    this.imageChangedEvent = event;
    this.currentPictureIndex = pictureIndex;
    this.isCropperVisible = true;
  }

  imageCropped(event: ImageCroppedEvent): void {
    if (event.base64) {
      this.croppedImage = event.base64;
    }
  }

  saveCroppedImage(): void {
    if (!this.croppedImage) return;

    this.picturesChosen[this.currentPictureIndex] = this.croppedImage;
    this.formGroup.patchValue({
      [`photo_${this.currentPictureIndex + 1}`]: {
        id: null,
        image: this.croppedImage,
      },
    });

    this.closePhotoSelection();
  }

  closePhotoSelection(): void {
    this.isCropperVisible = false;
    this.imageChangedEvent = null;
    this.croppedImage = null;
    this.isModalVisible = false;
  }
}
