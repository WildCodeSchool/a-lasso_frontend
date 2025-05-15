import { Component, inject, Input, OnInit } from '@angular/core';
import { Activity, Participant } from '../../models/activity.model';
import { ActivityFacadeService } from '../../services/activity-facade.service';
import { AsyncPipe, DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment.development';
import { InscriptionBadgeComponent } from '../inscription-badge/inscription-badge.component';
import { FavoriteHeartComponent } from '../favorite-heart/favorite-heart.component';
import { ButtonModule } from 'primeng/button';
import { SingleButtonComponent } from '../../../../common/components/single-button/single-button.component';
import { Observable, take, tap } from 'rxjs';
import { getImageSource } from 'src/app/common/utils/image.utils';
import { ButtonStyleClass } from 'src/app/common/models/button';

@Component({
  selector: 'app-activity-description',
  imports: [InscriptionBadgeComponent, FavoriteHeartComponent, DatePipe, ButtonModule, SingleButtonComponent, AsyncPipe],
  templateUrl: './activity-description.component.html',
  styleUrl: './activity-description.component.scss',
})
export class ActivityDescriptionComponent implements OnInit {
  @Input() activity!: Activity;

  private _activityFacadeService: ActivityFacadeService = inject(ActivityFacadeService);

  ButtonStyleClass = ButtonStyleClass;
  public apiUrl = environment.apiUrl;
  public isRegisteredActivity$: Observable<boolean>;
  public isSavedActivity$: Observable<boolean>;
  public voluntariesRegistered$: Observable<Participant>;

  ngOnInit(): void {
    this.isRegisteredActivity$ = this._activityFacadeService.getIsRegisteredActivity(this.activity.id);
    this.isSavedActivity$ = this._activityFacadeService.getIsSavedActivity(this.activity.id);
    this.voluntariesRegistered$ = this._activityFacadeService.getVoluntariesRegisteredToAnActivity(this.activity.id);
  }

  toggleRegister(activity: Activity): void {
    this.isRegisteredActivity$
      .pipe(
        tap((isRegistered: boolean) => {
          this._activityFacadeService.toggleRegister(activity.id, !isRegistered);
        }),
        take(1)
      )
      .subscribe();
  }

  getImageSrc(index: number): string {
    return getImageSource(this.activity, index);
  }
}
