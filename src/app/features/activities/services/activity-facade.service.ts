import { Injectable } from '@angular/core';
import { Activity } from '../models/activity.model';

@Injectable({
  providedIn: 'root',
})
export class ActivityFacadeService {
  getActivities(): Activity[] {
    // TODO appel service API et store
    return [];
  }
}
