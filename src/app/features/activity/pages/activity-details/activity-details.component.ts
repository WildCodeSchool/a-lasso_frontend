import { Component, HostListener, inject, OnDestroy, OnInit } from '@angular/core';
import { AssociationCardComponent } from '../../../association/components/association-card/association-card.component';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ToggleMenuComponent } from '../../../../common/components/toggle-menu/toggle-menu.component';
import { NgClass } from '@angular/common';
import { ActivityMessagesCardComponent } from '../../components/activity-messages-card/activity-messages-card.component';
import { ActivityDescriptionComponent } from '../../components/activity-description/activity-description.component';
import { MOBILE_SIZE } from '../../../../common/models/scss-variables';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-activity-details',
  imports: [AssociationCardComponent, ActivityDescriptionComponent, ToggleMenuComponent, NgClass, ActivityMessagesCardComponent],
  templateUrl: './activity-details.component.html',
  styleUrl: './activity-details.component.scss',
})
export class ActivityDetailsComponent implements OnInit, OnDestroy {
  private _routeSub!: Subscription;
  route: ActivatedRoute = inject(ActivatedRoute);
  activityId!: string;

  navigationItems: string[] = ['Activité', 'Messages', 'Association'];
  chosenNavigation: string = 'Activité';
  screenWidth: number = window.innerWidth;

  ngOnInit(): void {
    this._routeSub = this.route.paramMap.subscribe((params: ParamMap) => {
      this.activityId = String(params.get('id'));
    });
    this._updateNavigationItems(window.innerWidth);
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
    if (width < MOBILE_SIZE) {
      this.navigationItems = ['Activité', 'Messages', 'Association'];
      this.chosenNavigation = 'Activité';
    } else {
      this.navigationItems = ['Messages', 'Association'];
      this.chosenNavigation = 'Association';
    }
  }
}
