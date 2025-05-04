import { Component, DestroyRef, HostListener, inject, OnInit } from '@angular/core';
import { AssociationCardComponent } from '../../../association/components/association-card/association-card.component';
import { ActivatedRoute } from '@angular/router';
import { ToggleMenuComponent } from '../../../../common/components/toggle-menu/toggle-menu.component';
import { NgClass } from '@angular/common';
import { ActivityMessagesCardComponent } from '../../components/activity-messages-card/activity-messages-card.component';
import { ActivityDescriptionComponent } from '../../components/activity-description/activity-description.component';
import { MOBILE_SIZE } from '../../../../common/models/scss-variables';
import { AuthService } from '../../../authentication/services/auth.service';
import { Store } from '@ngrx/store';
import { selectActivitiesUserInfos, selectUser } from '../../../authentication/store/user.selectors';
import { UserType } from '../../../authentication/models/user.model';
import { Activity } from '../../models/activity.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Association } from 'src/app/features/association/models/association.model';
import { UUIDTypes } from 'uuid';
import { setNotificationMessages } from '../../../authentication/store/user.actions';

@Component({
  selector: 'app-activity-details',
  imports: [AssociationCardComponent, ActivityDescriptionComponent, ToggleMenuComponent, NgClass, ActivityMessagesCardComponent],
  templateUrl: './activity-details.component.html',
  styleUrl: './activity-details.component.scss',
})
export class ActivityDetailsComponent implements OnInit {
  private _authService: AuthService = inject(AuthService);
  private _route: ActivatedRoute = inject(ActivatedRoute);
  private _store: Store = inject(Store);
  private _destroyRef = inject(DestroyRef);
  activity!: Activity;
  association!: Association;

  activeTab: number = 0;
  navigationItems: string[] = ['Activité', 'Association'];
  chosenNavigation: string = 'Activité';
  screenWidth: number = window.innerWidth;

  ngOnInit(): void {
    this._updateNavigationItems(window.innerWidth);
    this.activity = this._route.snapshot.data['activityDetails']['activity'];
    this.association = this._route.snapshot.data['activityDetails']['association'];
    this._updateNavigationItems(window.innerWidth);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    const target = event.target as Window;
    this._updateNavigationItems(target.innerWidth);
    this.screenWidth = target.innerWidth;
  }

  handleNavigation(chosenNavigation: string): void {
    this.chosenNavigation = chosenNavigation;
    if (chosenNavigation === 'Messages') {
      this.updateNotificationMessages(this.activity.id);
    }
  }

  updateNotificationMessages(activityId: UUIDTypes): void {
    this._store.dispatch(setNotificationMessages({ activityId }));
  }

  private _updateNavigationItems(width: number): void {
    const userIsLoggedIn: boolean = this._authService.isLoggedIn();

    const setNavigation = (hasAccessToMessagesActivity: boolean): void => {
      const isMobile: boolean = width < MOBILE_SIZE;

      if (hasAccessToMessagesActivity) {
        this.navigationItems = isMobile ? ['Activité', 'Messages', 'Association'] : ['Messages', 'Association'];
        this.chosenNavigation = isMobile ? 'Activité' : 'Association';
        this.activeTab = isMobile ? 0 : 1;
      } else {
        this.navigationItems = isMobile ? ['Activité', 'Association'] : [];
        this.chosenNavigation = isMobile ? 'Activité' : 'Association';
      }
    };

    if (userIsLoggedIn) {
      const activitiesUserInfos$ = this._store.select(selectActivitiesUserInfos);
      const userInfos$ = this._store.select(selectUser);
      let isActivityOwner: boolean = false;
      let isRegistered: boolean = false;
      activitiesUserInfos$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((userInfos): void => {
        isRegistered = userInfos.find(activity => activity.activityId === this.activity.id)?.isRegistered ?? false;

        userInfos$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(user => {
          isActivityOwner = user?.type === UserType.Association && user?.name === this.activity.association.name;
        });
      });
      setNavigation(!!isRegistered || !!isActivityOwner);
    } else {
      setNavigation(false);
    }
  }
}
