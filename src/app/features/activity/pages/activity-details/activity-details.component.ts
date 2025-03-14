import { Component, HostListener, inject, OnInit } from '@angular/core';
import { AssociationCardComponent } from '../../../association/components/association-card/association-card.component';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ToggleMenuComponent } from '../../../../common/components/toggle-menu/toggle-menu.component';
import { NgClass } from '@angular/common';
import { ActivityMessagesCardComponent } from '../../components/activity-messages-card/activity-messages-card.component';
import { ActivityDescriptionComponent } from '../../components/activity-description/activity-description.component';

const MOBILE_SIZE: number = 900;

@Component({
  selector: 'app-activity-details',
  imports: [AssociationCardComponent, ActivityDescriptionComponent, ToggleMenuComponent, NgClass, ActivityMessagesCardComponent],
  templateUrl: './activity-details.component.html',
  styleUrl: './activity-details.component.scss',
})
export class ActivityDetailsComponent implements OnInit {
  route: ActivatedRoute = inject(ActivatedRoute);
  activityId!: string;

  navigationItems: string[] = ['Activité', 'Messages', 'Association'];
  chosenNavigation: string = 'Activité';
  screenWidth: number = window.innerWidth;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.activityId = String(params.get('id'));
    });
    this._updateNavigationItems(window.innerWidth);
  }

  handleNavigation(chosenNavigation: string): void {
    this.chosenNavigation = chosenNavigation;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    const target = event.target as Window;
    this._updateNavigationItems(target.innerWidth);
    this.screenWidth = target.innerWidth;
  }

  private _updateNavigationItems(width: number): void {
    if (width < MOBILE_SIZE) {
      this.navigationItems = ['Activité', 'Messages', 'Association'];
    } else {
      this.navigationItems = ['Messages', 'Association'];
    }
  }
}
