import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, switchMap, take, tap } from 'rxjs';
import { TAKE_1 } from '../../../common/constants/observables.constants';
import { Statistic } from '../../association/models/association.model';
import { AuthFacade } from '../../authentication/services/auth-facade.service';
import { AssociationProfileService } from './association-profil.service';
import { UserSelectors } from '../../authentication/store/user.selectors';
import { ActivitiesSelectors } from '../../activity/store/activities.selectors';
import { UserActions } from '../../authentication/store/user.actions';

@Injectable({ providedIn: 'root' })
export class AssociationProfileFacadeService {
  private _profileService = inject(AssociationProfileService);
  private _store = inject(Store);
  private _authFacade = inject(AuthFacade);

  readonly associationId$ = this._authFacade.associationId$;
  readonly userInfos$ = this._store.select(UserSelectors.selectUser);
  activities$ = this._store.select(ActivitiesSelectors.selectActivities);

  updateGeneralInfo(foundationDate: string, founder: string): void {
    this.associationId$.pipe(take(TAKE_1)).subscribe(id => {
      if (!id) return;
      this._profileService.updateGeneralInfo({ foundationDate, founder }).subscribe({
        next: () => {
          this._store.dispatch(UserActions.updateAssociationGeneralInfo({ foundationDate, founder }));
        },
      });
    });
  }

  updateDescription(description: string): void {
    this.associationId$.pipe(take(TAKE_1)).subscribe(id => {
      if (!id) return;
      this._profileService.updateDescription(description).subscribe({
        next: () => {
          this._store.dispatch(UserActions.updateAssociationDescription({ description }));
        },
      });
    });
  }

  updateCurrentAssociationStats(statistics: Statistic[]): Observable<void> {
    return this.associationId$.pipe(
      take(TAKE_1),
      switchMap(id => {
        if (!id) throw new Error('Association id is missing');
        return this._profileService.updateStats(statistics).pipe(
          tap(() => {
            this._store.dispatch(UserActions.updateAssociationStats({ statistics }));
          })
        );
      })
    );
  }
}
