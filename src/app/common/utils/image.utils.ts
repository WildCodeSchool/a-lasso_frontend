import { Activity } from 'src/app/features/activity/models/activity.model';
import { environment } from 'src/environments/environment.development';

export function getImageSource(activity: Activity, index: number = 0): string {
  const image = activity.images?.[index];

  return image.url ? environment.apiUrl + image.url : image.base64;
}
