import { Component, inject } from '@angular/core';
import { ActivitiesApiService } from '../../services/activities-api.service';
import { MessageService } from 'primeng/api';

export type Photo = {
  id: number;
  url: string;
};

@Component({
  selector: 'app-activity-add-photo',
  templateUrl: './activity-add-photo.component.html',
  styleUrls: ['./activity-add-photo.component.scss'],
})
export class ActivityAddPhotoComponent {
  photos: Photo[] = [
    { id: 1, url: '' },
    { id: 2, url: '' },
    { id: 3, url: '' },
  ];

  private _activitiesApiService: ActivitiesApiService = inject(ActivitiesApiService);
  private _toast: MessageService = inject(MessageService);

  triggerFileInput(index: number): void {
    const fileInput = document.getElementById('fileInput' + index) as HTMLElement;
    fileInput.click();
  }

  handleFileInput(event: Event, photoId: number): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      this._toast.add({
        severity: 'error',
        summary: 'No file',
      });
      return;
    }

    const maxFileSize = 5 * 1024 * 1024; // 5MB limit

    if (file.size > maxFileSize) {
      alert('Le fichier est trop volumineux (max 5MB).');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('photoId', photoId.toString());

    console.log('formData', formData);

    // this._activitiesApiService.uploadPhoto(formData);
  }
}
