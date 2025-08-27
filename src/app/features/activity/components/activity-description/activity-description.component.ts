import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { map, Observable, take } from 'rxjs';
import { TAKE_1 } from 'src/app/common/constants/observables.constants';
import { ButtonStyleClass } from 'src/app/common/models/button';
import { AuthService } from 'src/app/features/authentication/services/auth.service';
import { environment } from 'src/environments/environment';
import { SingleButtonComponent } from '../../../../common/components/single-button/single-button.component';
import { Activity, Participant } from '../../models/activity.model';
import { ActivityFacadeService } from '../../services/activity-facade.service';
import { FavoriteHeartComponent } from '../favorite-heart/favorite-heart.component';
import { InscriptionBadgeComponent } from '../inscription-badge/inscription-badge.component';

@Component({
  selector: 'app-activity-description',
  imports: [InscriptionBadgeComponent, FavoriteHeartComponent, DatePipe, ButtonModule, SingleButtonComponent, AsyncPipe],
  templateUrl: './activity-description.component.html',
  styleUrl: './activity-description.component.scss',
})
export class ActivityDescriptionComponent implements OnInit {
  @Input() activity!: Activity;

  private _activityFacadeService: ActivityFacadeService = inject(ActivityFacadeService);
  private _authService: AuthService = inject(AuthService);

  ButtonStyleClass = ButtonStyleClass;
  public apiUrl: string = environment.apiUrl;
  public isRegisteredActivity$: Observable<boolean>;
  public isSavedActivity$: Observable<boolean>;
  public voluntariesRegistered$: Observable<Participant>;

  isVoluntary$: Observable<boolean> = this._authService.isVoluntaryUser();
  isNotFull$: Observable<boolean>;

  ngOnInit(): void {
    this.isRegisteredActivity$ = this._activityFacadeService.getIsRegisteredActivity(this.activity.id);
    this.isSavedActivity$ = this._activityFacadeService.getIsSavedActivity(this.activity.id);
    this.voluntariesRegistered$ = this._activityFacadeService.getVoluntariesRegisteredToAnActivity(this.activity.id);
    this.isNotFull$ = this.voluntariesRegistered$.pipe(map(participants => participants.current < participants.max));
  }

  toggleRegister(activity: Activity): void {
    this.isRegisteredActivity$.pipe(take(TAKE_1)).subscribe(isRegistered => {
      this._activityFacadeService.toggleRegister(activity.id, !isRegistered);
    });
  }
}
