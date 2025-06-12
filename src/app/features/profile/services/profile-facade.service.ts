import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, switchMap, take, tap } from 'rxjs';
import { TAKE_1 } from 'src/app/common/constants/observables.constants';
import { selectActivities } from '../../activity/store/activities.selector';
import { Statistic } from '../../association/models/association.model';
import { AuthFacade } from '../../authentication/services/auth-facade.service';
import * as UserActions from '../../authentication/store/user.actions';
import { selectUser } from '../../authentication/store/user.selectors';
import { AssociationProfileService } from './association-profil.service';

@Injectable({ providedIn: 'root' })
export class ProfileFacadeService {
  private _profileService = inject(AssociationProfileService);
  private _store = inject(Store);
  private _authFacade = inject(AuthFacade);

  readonly associationId$ = this._authFacade.associationId$;
  readonly userInfos$ = this._store.select(selectUser);
  activities$ = this._store.select(selectActivities);

  updateGeneralInfo(foundationDate: string, founder: string): void {
    this.associationId$.pipe(take(TAKE_1)).subscribe(id => {
      if (!id) return;
      this._profileService.updateGeneralInfo(id, { foundationDate, founder }).subscribe({
        next: () => {
          this._store.dispatch(UserActions.updateAssociationGeneralInfo({ foundationDate, founder }));
        },
      });
    });
  }

  updateDescription(description: string): void {
    this.associationId$.pipe(take(TAKE_1)).subscribe(id => {
      if (!id) return;
      this._profileService.updateDescription(id, description).subscribe({
        next: () => {
          this._store.dispatch(UserActions.updateAssociationDescription({ description }));
        },
      });
    });
  }

  updateStats(statistics: Statistic[]): Observable<void> {
    return this.associationId$.pipe(
      take(TAKE_1),
      switchMap(id => {
        if (!id) throw new Error('Association id is missing');
        return this._profileService.updateStats(id.toString(), statistics).pipe(
          tap(() => {
            this._store.dispatch(UserActions.updateAssociationStats({ statistics }));
          })
        );
      })
    );
  }
}
