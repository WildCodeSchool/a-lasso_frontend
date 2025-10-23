import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { ActivityStatusEnum } from 'src/app/features/activity/models/activity-creation.model';
import { Activity } from 'src/app/features/activity/models/activity.model';
import { ActivityFacadeService } from 'src/app/features/activity/services/activity-facade.service';
import { UUIDTypes } from 'uuid';
import { ActivityListComponent } from '../../activity-list/activity-list.component';
import { ActivityMenuComponent } from '../../activity-menu/activity-menu.component';

@Component({
  selector: 'app-association-activity-menu',
  standalone: true,
  imports: [ActivityMenuComponent, ActivityListComponent, AsyncPipe],
  templateUrl: './association-activity-menu.component.html',
  styleUrls: ['./association-activity-menu.component.scss'],
})
export class AssociationActivityMenuComponent implements OnInit {
  private _activityFacade = inject(ActivityFacadeService);

  navigationItems = [{ name: 'Futures' }, { name: 'Passées' }, { name: 'Brouillons' }];
  activeTab = 0;
  currentTab = 'Futures';

  activities$: Observable<Activity[]> = this._activityFacade.activities$;
  associationId$: Observable<UUIDTypes | null> = this._activityFacade.associationId$;
  chosenNavigation$ = new BehaviorSubject<string>('Futures');
  filteredActivities$!: Observable<Activity[]>;

  ngOnInit(): void {
    this._loadActivitiesForTab(this.chosenNavigation$.value);
    this._filterActivitiesForTab();
  }

  handleTabChange(tab: string): void {
    this.activeTab = this.navigationItems.findIndex(item => item.name === tab);
    this.chosenNavigation$.next(tab);
    this._loadActivitiesForTab(tab);
  }

  private _loadActivitiesForTab(tab: string): void {
    if (tab === 'Futures') {
      this._activityFacade.getFutureActivitiesFromApi();
    } else if (tab === 'Passées') {
      this._activityFacade.getPastActivitiesFromApi();
    } else if (tab === 'Brouillons') {
      this._activityFacade.getDraftActivitiesFromApi();
    }
  }

  private _filterActivitiesForTab(): void {
    this.filteredActivities$ = combineLatest([this.activities$, this.associationId$, this.chosenNavigation$]).pipe(
      map(([activities, associationId, chosenNavigation]) => {
        if (!associationId) return [];
        if (['Futures', 'Passées'].includes(chosenNavigation)) {
          return activities.filter(activity => activity.association.id === associationId && activity.status === ActivityStatusEnum.PUBLISHED);
        }
        if (chosenNavigation === 'Brouillons') {
          return activities.filter(activity => activity.association.id === associationId && activity.status === ActivityStatusEnum.DRAFT);
        }
        return [];
      })
    );
  }
}
