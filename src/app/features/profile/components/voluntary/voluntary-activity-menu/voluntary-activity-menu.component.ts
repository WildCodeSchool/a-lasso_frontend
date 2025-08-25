import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { Activity } from 'src/app/features/activity/models/activity.model';
import { ActivityFacadeService } from 'src/app/features/activity/services/activity-facade.service';
import { UUIDTypes } from 'uuid';
import { ActivityListComponent } from '../../activity-list/activity-list.component';
import { ActivityMenuComponent } from '../../activity-menu/activity-menu.component';
import { VoluntaryFollowedAssociationsComponent } from '../voluntary-followed-associations/voluntary-followed-associations.component';
import { VoluntarySavedActivitiesComponent } from '../voluntary-saved-activities/voluntary-saved-activities.component';

@Component({
  selector: 'app-voluntary-activity-menu',
  standalone: true,
  imports: [
    CommonModule,
    ActivityListComponent,
    AsyncPipe,
    ActivityMenuComponent,
    VoluntarySavedActivitiesComponent,
    VoluntaryFollowedAssociationsComponent,
  ],
  templateUrl: './voluntary-activity-menu.component.html',
  styleUrl: './voluntary-activity-menu.component.scss',
})
export class VoluntaryActivityMenuComponent implements OnInit {
  private _activityFacade: ActivityFacadeService = inject(ActivityFacadeService);

  navigationItems = [{ name: 'Futures' }, { name: 'Passées' }, { name: 'Enregistrées' }, { name: 'Associations' }];
  activeTab: number = 0;
  chosenNavigation$ = new BehaviorSubject<string>('Futures');

  activities$: Observable<Activity[]> = this._activityFacade.activities$;
  registeredActivityIds$: Observable<UUIDTypes[]> = this._activityFacade.registeredActivityIds$;

  get filteredActivities$(): Observable<Activity[]> {
    return combineLatest([this.activities$, this.registeredActivityIds$, this.chosenNavigation$]).pipe(
      map(([activities, registeredIds, chosenNavigation]) => {
        const today = new Date();

        return activities.filter(activity => {
          if (!registeredIds.map(id => id.toString()).includes(activity.id.toString())) return false;

          const activityDate = new Date(activity.date);
          if (chosenNavigation === 'Futures') return activityDate >= today;
          if (chosenNavigation === 'Passées') return activityDate < today;

          return true;
        });
      })
    );
  }

  ngOnInit(): void {
    this._activityFacade.getAllActivitiesFromApi();
  }

  handleNavigation(chosenNavigation: string): void {
    this.activeTab = this.navigationItems.findIndex(item => item.name === chosenNavigation);
    this.chosenNavigation$.next(chosenNavigation);
  }
}
