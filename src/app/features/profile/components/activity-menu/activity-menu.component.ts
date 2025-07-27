import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ToggleMenuComponent } from 'src/app/common/components/toggle-menu/toggle-menu.component';
import { ActivityListComponent } from '../activity-list/activity-list.component';
import { ActivityFacadeService } from 'src/app/features/activity/services/activity-facade.service';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { Activity } from 'src/app/features/activity/models/activity.model';
import { UUIDTypes } from 'uuid';
import { NavigationItems } from 'src/app/common/models/toggle-menu';
import { ActivityStatusEnum } from 'src/app/features/activity/models/activity-creation.model';

const ACTIVE_TAB = 0;

@Component({
  selector: 'app-activity-menu',
  imports: [CommonModule, ToggleMenuComponent, ActivityListComponent],
  templateUrl: './activity-menu.component.html',
  styleUrl: './activity-menu.component.scss',
  standalone: true,
})
export class ActivityMenuComponent implements OnInit {
  activityFacade: ActivityFacadeService = inject(ActivityFacadeService);

  activeTab: number = ACTIVE_TAB;
  navigationItems: NavigationItems[] = [{ name: 'Futur' }, { name: 'Passé' }, { name: 'Brouillons' }];
  chosenNavigation: string = 'Futur';

  activities$: Observable<Activity[]> = this.activityFacade.activities$;
  associationId$: Observable<UUIDTypes | null> = this.activityFacade.associationId$;
  chosenNavigation$ = new BehaviorSubject<string>('Futur');

  get filteredActivities$(): Observable<Activity[]> {
    return combineLatest([this.activities$, this.associationId$, this.chosenNavigation$]).pipe(
      map(([activities, associationId, chosenNavigation]) => {
        if (!associationId) return [];

        const today = new Date();
        return activities.filter(activity => {
          if (activity.association.id !== associationId) return false;

          const activityDate = new Date(activity.date);
          if (chosenNavigation === 'Futur') return activityDate >= today && activity.status === ActivityStatusEnum.PUBLISHED;
          if (chosenNavigation === 'Passé') return activityDate < today && activity.status === ActivityStatusEnum.PUBLISHED;
          if (chosenNavigation === 'Brouillons') return activity.status === ActivityStatusEnum.DRAFT;

          return true;
        });
      })
    );
  }

  ngOnInit(): void {
    this.activityFacade.getAllActivitiesFromApi();
  }

  handleNavigation(chosenNavigation: string): void {
    this.activeTab = this.navigationItems.findIndex(item => item.name === chosenNavigation);
    this.chosenNavigation$.next(chosenNavigation);
  }
}
