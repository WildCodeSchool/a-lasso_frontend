import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Card } from 'primeng/card';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/features/authentication/services/auth.service';
import { environment } from 'src/environments/environment.development';
import { TruncatePipe } from '../../../../common/pipes/TruncateString.pipe';
import { Activity, Participant } from '../../models/activity.model';
import { ActivityFacadeService } from '../../services/activity-facade.service';
import { FavoriteHeartComponent } from '../favorite-heart/favorite-heart.component';
import { InscriptionBadgeComponent } from '../inscription-badge/inscription-badge.component';

@Component({
  selector: 'app-activity-card',
  imports: [InscriptionBadgeComponent, FavoriteHeartComponent, TruncatePipe, DatePipe, RouterLink, Card, AsyncPipe],
  templateUrl: './activity-card.component.html',
  styleUrl: './activity-card.component.scss',
  standalone: true,
})
export class ActivityCardComponent implements OnInit {
  @Output() delete = new EventEmitter<string>();
  @Output() edit = new EventEmitter<string>();

  @Input() activity!: Activity;
  @Input() showDeleteButton: boolean = false;
  @Input() showEditButton: boolean = false;

  private _activityFacadeService: ActivityFacadeService = inject(ActivityFacadeService);
  private _authService = inject(AuthService);

  public isSavedActivity$: Observable<boolean>;
  public voluntariesRegistered$: Observable<Participant>;
  public apiUrl = environment.apiUrl;

  isVoluntary$: Observable<boolean> = this._authService.isVoluntaryUser();

  ngOnInit(): void {
    this.isSavedActivity$ = this._activityFacadeService.getIsSavedActivity(this.activity.id);
    this.voluntariesRegistered$ = this._activityFacadeService.getVoluntariesRegisteredToAnActivity(this.activity.id);
  }

  onDeleteClick(event: MouseEvent): void {
    event.stopPropagation();
    this.delete.emit(this.activity.id);
  }

  onEditClick(event: MouseEvent): void {
    event.stopPropagation();
    this.edit.emit(this.activity.id);
  }
}
