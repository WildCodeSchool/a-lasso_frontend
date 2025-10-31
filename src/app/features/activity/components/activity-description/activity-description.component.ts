import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { combineLatest, map, Observable, take } from 'rxjs';
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
  providers: [],
  templateUrl: './activity-description.component.html',
  styleUrl: './activity-description.component.scss',
})
export class ActivityDescriptionComponent implements OnInit {
  private _activityFacadeService: ActivityFacadeService = inject(ActivityFacadeService);
  private _authService: AuthService = inject(AuthService);
  private _confirmationService: ConfirmationService = inject(ConfirmationService);

  @Input() activity!: Activity;

  ButtonStyleClass = ButtonStyleClass;
  public apiUrl: string = environment.apiUrl;
  public today: Date = new Date();
  public isRegisteredActivity$: Observable<boolean>;
  public isSavedActivity$: Observable<boolean>;
  public voluntariesRegistered$: Observable<Participant>;

  isVoluntary$: Observable<boolean> = this._authService.isVoluntaryUser();
  isAssociation$: Observable<boolean> = this._authService.isAssociationUser();
  isNotFull$: Observable<boolean>;
  canShowRegisterButton$: Observable<boolean>;

  ngOnInit(): void {
    this.isRegisteredActivity$ = this._activityFacadeService.getIsRegisteredActivity(this.activity.id);
    this.isSavedActivity$ = this._activityFacadeService.getIsSavedActivity(this.activity.id);
    this.voluntariesRegistered$ = this._activityFacadeService.getVoluntariesRegisteredToAnActivity(this.activity.id);
    this.isNotFull$ = this.voluntariesRegistered$.pipe(map(participants => participants.current < participants.max));
    this.canShowRegisterButton$ = combineLatest([this.isNotFull$, this.isRegisteredActivity$, this.isVoluntary$]).pipe(
      map(([isNotFull, isRegistered]) => isNotFull || isRegistered)
    );
  }

  isActivityUpcoming(): boolean {
    const activityDate = new Date(this.activity.date);
    return activityDate >= this.today;
  }

  onRegisterClick(activity: Activity): void {
    this.isVoluntary$.pipe(take(TAKE_1)).subscribe(isVoluntary => {
      if (isVoluntary) {
        this.isRegisteredActivity$.pipe(take(TAKE_1)).subscribe(isRegistered => {
          if (isRegistered) {
            this._confirmationService.confirm({
              message: 'Êtes-vous sûr de vouloir vous désinscrire de cette activité ?',
              header: 'Confirmation',
              icon: 'pi pi-exclamation-triangle',
              acceptLabel: 'Oui',
              rejectLabel: 'Non',
              dismissableMask: true,
              accept: () => this.toggleRegister(activity),
            });
            this.toggleRegister(activity);
          } else {
            this.toggleRegister(activity);
          }
        });
      } else {
        this._confirmationService.confirm({
          message: "Seuls les utilisateurs connectés peuvent s'inscrire aux activités.",
          header: 'Information',
          icon: 'pi pi-info-circle',
          acceptLabel: 'Se connecter maintenant',
          rejectVisible: false,
          dismissableMask: true,
          accept: () => this.navigateToLogin(),
        });
      }
    });
  }

  toggleRegister(activity: Activity): void {
    this.isRegisteredActivity$.pipe(take(TAKE_1)).subscribe(isRegistered => {
      this._activityFacadeService.toggleRegister(activity.id, !isRegistered);
    });
  }

  navigateToLogin(): void {
    this._authService.triggerLoginModal();
  }
}
