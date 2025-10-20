import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Card } from 'primeng/card';
import { combineLatest, map, Observable } from 'rxjs';
import { AuthService } from 'src/app/features/authentication/services/auth.service';
import { environment } from 'src/environments/environment';
import { TruncatePipe } from '../../../../common/pipes/truncate-string.pipe';
import { Activity, Participant } from '../../models/activity.model';
import { ActivityFacadeService } from '../../services/activity-facade.service';
import { FavoriteHeartComponent } from '../favorite-heart/favorite-heart.component';
import { InscriptionBadgeComponent } from '../inscription-badge/inscription-badge.component';
import { UUIDTypes } from 'uuid';
import { AuthFacade } from '../../../authentication/services/auth-facade.service';

@Component({
  selector: 'app-activity-card',
  imports: [InscriptionBadgeComponent, FavoriteHeartComponent, TruncatePipe, DatePipe, RouterLink, Card, AsyncPipe],
  templateUrl: './activity-card.component.html',
  styleUrl: './activity-card.component.scss',
  standalone: true,
})
export class ActivityCardComponent implements OnInit {
  @Output() deleteActivity = new EventEmitter<string>();
  @Output() editActivity = new EventEmitter<string>();

  @Input() activity!: Activity;
  @Input() showEditButton: boolean = false;

  private _activityFacadeService: ActivityFacadeService = inject(ActivityFacadeService);
  private _authService = inject(AuthService);
  private _authFacadeService = inject(AuthFacade);

  public isSavedActivity$: Observable<boolean>;
  public voluntariesRegistered$: Observable<Participant>;
  public apiUrl: string = environment.apiUrl;
  public associationLogoUrl!: string;
  public showDeleteButton: boolean = false;
  isVoluntary$: Observable<boolean> = this._authService.isVoluntaryUser();
  isAssociation$: Observable<boolean> = this._authService.isAssociationUser();
  isAdmin$: Observable<boolean> = this._authService.isAdminUser();
  connectedUserId$: Observable<UUIDTypes> = this._authFacadeService.getConnectedUserId();
  showFavorite$: Observable<boolean> = combineLatest([this.isVoluntary$, this.isAdmin$]).pipe(
    map(([isVoluntary, isAdmin]) => isVoluntary && !isAdmin)
  );

  ngOnInit(): void {
    this.isSavedActivity$ = this._activityFacadeService.getIsSavedActivity(this.activity.id);
    this.voluntariesRegistered$ = this._activityFacadeService.getVoluntariesRegisteredToAnActivity(this.activity.id);
    this._setAssociationLogoUrl();

    combineLatest([this.isAssociation$, this.isAdmin$, this.connectedUserId$]).subscribe(([isAssociation, isAdmin, connectedUserId]) => {
      if ((isAssociation && this.activity.association.id === connectedUserId) || isAdmin) {
        this.showDeleteButton = true;
      }
    });
  }

  onDeleteClick(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.deleteActivity.emit(this.activity.id);
  }

  onEditClick(event: MouseEvent): void {
    event.stopPropagation();
    this.editActivity.emit(this.activity.id);
  }

  private _setAssociationLogoUrl(): void {
    const logo = this.activity.association.logo;
    if (logo && logo.startsWith('data:image')) {
      this.associationLogoUrl = logo;
    } else {
      this.associationLogoUrl = this.apiUrl + logo;
    }
  }
}
