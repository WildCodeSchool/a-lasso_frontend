import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Card } from 'primeng/card';
import { map, Observable } from 'rxjs';
import { UserRole } from 'src/app/features/authentication/constants/auth.constants';
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

  @Input() activity!: Activity;
  @Input() showDeleteButton: boolean = false;

  private _activityFacadeService: ActivityFacadeService = inject(ActivityFacadeService);
  private _authService = inject(AuthService);

  public isSavedActivity$: Observable<boolean>;
  public voluntariesRegistered$: Observable<Participant>;
  public apiUrl = environment.apiUrl;

  isVoluntary$: Observable<boolean> = this._authService
    .getRolesUser()
    .pipe(map((roles: UserRole[]) => roles.some(role => role === UserRole.VOLUNTARY)));

  ngOnInit(): void {
    this.isSavedActivity$ = this._activityFacadeService.getIsSavedActivity(this.activity.id);
    this.voluntariesRegistered$ = this._activityFacadeService.getVoluntariesRegisteredToAnActivity(this.activity.id);
  }

  onDeleteClick(event: MouseEvent): void {
    event.stopPropagation();
    this.delete.emit(this.activity.id);
  }
}
