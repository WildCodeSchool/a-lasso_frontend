import { Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { Activity, AssociationActivity } from '../../../activity/models/activity.model';
import { environment } from '../../../../../environments/environment';
import { TruncatePipe } from '../../../../common/pipes/TruncateString.pipe';
import { AsyncPipe, DatePipe } from '@angular/common';
import { InscriptionBadgeComponent } from '../../../activity/components/inscription-badge/inscription-badge.component';
import { FavoriteHeartComponent } from '../../../activity/components/favorite-heart/favorite-heart.component';
import { UUIDTypes } from 'uuid';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectActivities } from '../../../activity/store/activities.selector';
import { Observable, take } from 'rxjs';

@Component({
  selector: 'app-popup-map',
  imports: [TruncatePipe, InscriptionBadgeComponent, DatePipe, FavoriteHeartComponent, AsyncPipe],
  templateUrl: './popup-map.component.html',
  styleUrl: './popup-map.component.scss',
})
export class PopupMapComponent {
  private _router: Router = inject(Router);
  private _store: Store = inject(Store);

  @Input() activity!: Activity;
  @Input() isSavedActivity$!: Observable<boolean>;
  @Input() association!: AssociationActivity;
  @ViewChild('content', { static: true }) content!: ElementRef;

  public apiUrl: string = environment.apiUrl;
  public activityCountByAssociation: number = 0;

  public setCountActivityOfAssociation(association: AssociationActivity): void {
    this.association = association;
    this._store
      .select(selectActivities)
      .pipe(take(1))
      .subscribe(activities => {
        this.activityCountByAssociation = activities.filter(activity => activity.association?.id === association.id).length;
      });
  }

  get element(): HTMLElement {
    return this.content.nativeElement;
  }

  navigate(whereNavigate: string, idToNavigate: UUIDTypes): void {
    if (whereNavigate === 'activity') {
      this._router.navigate([`/activity/${idToNavigate}`]);
    } else {
      this._router.navigate([`/association/${idToNavigate}`]);
    }
  }
}
