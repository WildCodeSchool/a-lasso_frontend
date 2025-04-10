import { Component, HostListener, inject, OnDestroy, OnInit } from '@angular/core';
import { AssociationCardComponent } from '../../../association/components/association-card/association-card.component';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ToggleMenuComponent } from '../../../../common/components/toggle-menu/toggle-menu.component';
import { NgClass } from '@angular/common';
import { ActivityMessagesCardComponent } from '../../components/activity-messages-card/activity-messages-card.component';
import { ActivityDescriptionComponent } from '../../components/activity-description/activity-description.component';
import { MOBILE_SIZE } from '../../../../common/models/scss-variables';
import { filter, Observable, of, Subscription, switchMap, take } from 'rxjs';
import { AuthService } from '../../../authentication/services/auth.service';
import { Store } from '@ngrx/store';
import { selectActivitiesUserInfos } from '../../../authentication/store/user.selectors';
import { ActivitiesUserInfos } from '../../../authentication/models/user.model';
import { Activity } from '../../models/activity.model';
import { ActivityFacadeService } from '../../services/activity-facade.service';

@Component({
  selector: 'app-activity-details',
  imports: [AssociationCardComponent, ActivityDescriptionComponent, ToggleMenuComponent, NgClass, ActivityMessagesCardComponent],
  templateUrl: './activity-details.component.html',
  styleUrl: './activity-details.component.scss',
})
export class ActivityDetailsComponent implements OnInit, OnDestroy {
  private _routeSub!: Subscription;
  authService: AuthService = inject(AuthService);
  activityFacadeService: ActivityFacadeService = inject(ActivityFacadeService);
  store: Store = inject(Store);
  route: ActivatedRoute = inject(ActivatedRoute);
  activityId!: string;
  activity$!: Observable<Activity>;

  activeTab: number = 0;
  navigationItems: string[] = ['Activité', 'Association'];
  chosenNavigation: string = 'Activité';
  screenWidth: number = window.innerWidth;

  ngOnInit(): void {
    this._routeSub = this.route.paramMap.subscribe((params: ParamMap) => {
      this.activityId = String(params.get('id'));
    });
    this._updateNavigationItems(window.innerWidth);

    this.activity$ = this.activityFacadeService.getActivityFromStore$(this.activityId).pipe(
      switchMap(activity => {
        if (activity?.location?.city) {
          return of(activity);
        }

        this.activityFacadeService.getAllActivitiesFromApi();
        return this.activityFacadeService.getActivityFromStore$(this.activityId).pipe(
          filter((a): a is Activity => !!a && !!a.location?.city),
          take(1)
        );
      })
    );
  }

  ngOnDestroy(): void {
    if (this._routeSub) {
      this._routeSub.unsubscribe();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    const target = event.target as Window;
    this._updateNavigationItems(target.innerWidth);
    this.screenWidth = target.innerWidth;
  }

  handleNavigation(chosenNavigation: string): void {
    this.chosenNavigation = chosenNavigation;
  }

  private _updateNavigationItems(width: number): void {
    const userIsLoggedIn: boolean = this.authService.isLoggedIn();

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
      const activitiesUserInfos$: Observable<ActivitiesUserInfos[]> = this.store.select(selectActivitiesUserInfos);

      activitiesUserInfos$.pipe().subscribe((userInfos): void => {
        const isRegistered: boolean = userInfos.find((activity): boolean => activity.activityId === this.activityId)?.isRegistered;

        setNavigation(!!isRegistered);
      });
    } else {
      setNavigation(false);
    }
  }
}
