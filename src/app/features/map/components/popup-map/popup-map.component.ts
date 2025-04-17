import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import { UUIDTypes } from 'uuid';
import { environment } from '../../../../../environments/environment';
import { TruncatePipe } from '../../../../common/pipes/TruncateString.pipe';
import { InscriptionBadgeComponent } from '../../../activity/components/inscription-badge/inscription-badge.component';
import { Activity, AssociationActivity } from '../../../activity/models/activity.model';
import { selectActivities } from '../../../activity/store/activities.selector';

@Component({
  selector: 'app-popup-map',
  imports: [TruncatePipe, InscriptionBadgeComponent, DatePipe],
  templateUrl: './popup-map.component.html',
  styleUrl: './popup-map.component.scss',
})
export class PopupMapComponent implements OnInit {
  private _router: Router = inject(Router);
  private _store: Store = inject(Store);

  @Output() popupClosed = new EventEmitter<void>();
  @ViewChild('content', { static: true }) content!: ElementRef;

  public apiUrl: string = environment.apiUrl;
  public activityCountByAssociation: number = 0;
  public associationLogoUrl!: string;
  public isSavedActivity$!: Observable<boolean>;

  private _activity: Activity | null = null;
  private _association: AssociationActivity | null = null;

  @Input()
  set activity(value: Activity | null) {
    this._activity = value;
    this._setAssociationLogoUrl();
  }
  get activity(): Activity | null {
    return this._activity;
  }

  @Input()
  set association(value: AssociationActivity | null) {
    this._association = value;
    this._setAssociationLogoUrl();
  }
  get association(): AssociationActivity | null {
    return this._association;
  }

  ngOnInit(): void {
    this._setAssociationLogoUrl();
  }

  public setCountActivityOfAssociation(association: AssociationActivity): void {
    this._association = association;
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

  closePopup(): void {
    this.popupClosed.emit();
  }

  private _setAssociationLogoUrl(): void {
    const logo = this._association?.logo ?? this._activity?.association?.logo;

    if (logo.startsWith('data:image')) {
      this.associationLogoUrl = logo;
    } else {
      this.associationLogoUrl = this.apiUrl + logo;
    }
  }
}
