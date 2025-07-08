import { Component, inject, OnInit } from '@angular/core';
import { AssociationCardComponent } from '../../../association/components/association-card/association-card.component';
import { ActivatedRoute } from '@angular/router';
import { ToggleMenuComponent } from '../../../../common/components/toggle-menu/toggle-menu.component';
import { AsyncPipe, NgClass } from '@angular/common';
import { ActivityMessagesCardComponent } from '../../components/activity-messages-card/activity-messages-card.component';
import { ActivityDescriptionComponent } from '../../components/activity-description/activity-description.component';
import { MOBILE_SIZE } from '../../../../common/models/scss-variables';
import { Store } from '@ngrx/store';
import { selectActivitiesUserInfos, selectUser } from '../../../authentication/store/user.selectors';
import { ActivitiesUserInfos, UserType } from '../../../authentication/models/user.model';
import { Activity, ActivityDetailsNavigation } from '../../models/activity.model';
import { Association } from 'src/app/features/association/models/association.model';
import { UUIDTypes } from 'uuid';
import { setNotificationMessages } from '../../../authentication/store/user.actions';
import { NavigationItems } from '../../../../common/models/toggle-menu';
import { BehaviorSubject, combineLatest, distinctUntilChanged, fromEvent, map, Observable, startWith } from 'rxjs';
import { DestroyableComponent } from '../../../../common/utils/DestroyableComponent';

@Component({
  selector: 'app-activity-details',
  imports: [AssociationCardComponent, ActivityDescriptionComponent, ToggleMenuComponent, NgClass, ActivityMessagesCardComponent, AsyncPipe],
  templateUrl: './activity-details.component.html',
  styleUrl: './activity-details.component.scss',
})
export class ActivityDetailsComponent extends DestroyableComponent implements OnInit {
  private _route: ActivatedRoute = inject(ActivatedRoute);
  private _store: Store = inject(Store);
  private _chosenNavigation$ = new BehaviorSubject<string>('Activité');

  screenWidth$ = fromEvent(window, 'resize').pipe(
    map(() => window.innerWidth),
    startWith(window.innerWidth),
    distinctUntilChanged(),
    this.untilDestroyed()
  );

  navigationState$: Observable<ActivityDetailsNavigation> = this._buildNavigationState();

  activity!: Activity;
  association!: Association;

  ngOnInit(): void {
    this._initializeActivityAndAssociation();
  }

  handleNavigation(chosen: string): void {
    this._chosenNavigation$.next(chosen);

    if (chosen === 'Messages') {
      this.updateNotificationMessages(this.activity.id);
    }
  }

  updateNotificationMessages(activityId: UUIDTypes): void {
    this._store.dispatch(setNotificationMessages({ activityId }));
  }

  private _initializeActivityAndAssociation(): void {
    this.activity = this._route.snapshot.data['activityDetails']['activity'];
    this.association = this._route.snapshot.data['activityDetails']['association'];
  }

  private _isUserRegistered(activitiesUserInfos: ActivitiesUserInfos[]): boolean {
    return activitiesUserInfos.find(activity => activity.activityId === this.activity.id)?.isRegistered ?? false;
  }

  private _buildNavigationState(): Observable<ActivityDetailsNavigation> {
    return combineLatest([
      this._store.select(selectActivitiesUserInfos),
      this._store.select(selectUser),
      this.screenWidth$,
      this._chosenNavigation$,
    ]).pipe(
      this.untilDestroyed(),
      map(([userInfos, user, width, chosen]) => {
        const isMobile = width < MOBILE_SIZE;
        const isRegistered = this._isUserRegistered(userInfos);
        const isOwner = user?.type === UserType.Association && user.name === this.activity.association.name;
        const hasMessages = isRegistered || isOwner;

        let tabs: NavigationItems[] = [];
        if (hasMessages) {
          tabs = isMobile ? [{ name: 'Activité' }, { name: 'Messages' }, { name: 'Association' }] : [{ name: 'Messages' }, { name: 'Association' }];
        } else {
          tabs = isMobile ? [{ name: 'Activité' }, { name: 'Association' }] : [];
        }

        let validChosen = tabs.find(tab => tab.name === chosen)?.name;
        if (!validChosen) {
          validChosen = tabs.find(tab => tab.name === 'Association')?.name ?? tabs[0]?.name ?? '';
          if (validChosen && validChosen !== chosen) {
            this._chosenNavigation$.next(validChosen);
          }
        }

        const activeTabIndex = tabs.findIndex(tab => tab.name === validChosen);

        return {
          tabs,
          chosen: validChosen,
          activeTabIndex,
        };
      })
    );
  }
}
