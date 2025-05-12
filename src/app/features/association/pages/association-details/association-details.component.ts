import { Component, HostListener, inject, OnInit } from '@angular/core';
import { ToggleMenuComponent } from '../../../../common/components/toggle-menu/toggle-menu.component';
import { AssociationCardComponent } from '../../components/association-card/association-card.component';
import { AsyncPipe, NgClass } from '@angular/common';
import { ActivityCardComponent } from '../../../activity/components/activity-card/activity-card.component';
import { Observable } from 'rxjs';
import { Activity } from '../../../activity/models/activity.model';
import { ActivityFacadeService } from '../../../activity/services/activity-facade.service';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { Association } from '../../models/association.model';
import { MOBILE_SIZE } from '../../../../common/models/scss-variables';
import { NavigationItems } from '../../../../common/models/toggleMenu';

@Component({
  selector: 'app-association-details',
  imports: [ToggleMenuComponent, AssociationCardComponent, NgClass, ActivityCardComponent, AsyncPipe],
  templateUrl: './association-details.component.html',
  styleUrl: './association-details.component.scss',
})
export class AssociationDetailsComponent implements OnInit {
  private _activityFacadeService: ActivityFacadeService = inject(ActivityFacadeService);
  private _route: ActivatedRoute = inject(ActivatedRoute);
  activities$: Observable<Activity[]> = this._activityFacadeService.activities$;
  association!: Association;

  navigationItems: NavigationItems[] = [];
  chosenNavigation: string = 'Activités';
  screenWidth: number = window.innerWidth;

  ngOnInit(): void {
    const associationId = this._route.snapshot.paramMap.get('id');
    this.association = this._route.snapshot.data['association'];
    this.activities$ = this.activities$.pipe(map(activities => activities.filter(activity => activity.association.id === associationId)));
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    const target = event.target as Window;
    this._updateNavigationItems(target.innerWidth);
    this.screenWidth = target.innerWidth;
  }

  private _updateNavigationItems(width: number): void {
    const isMobile: boolean = width < MOBILE_SIZE;
    if (isMobile) {
      this.navigationItems = [{ name: 'Activités' }, { name: 'Association' }];
    } else {
      this.navigationItems = [];
    }
  }

  handleNavigation(title: string): void {
    this.chosenNavigation = title;
  }
}
