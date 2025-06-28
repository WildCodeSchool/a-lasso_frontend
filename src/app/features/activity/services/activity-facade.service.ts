import { Injectable, inject } from '@angular/core';
import { Activity, Participant, Theme } from '../models/activity.model';
import { filter, map, Observable, of, switchMap, take, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectActivities, selectActivityById } from '../store/activities.selector';
import { setActivities, setActivity, updateActivityParticipants } from '../store/activities.actions';
import { ActivitiesApiService } from './activities-api.service';
import { UUIDTypes } from 'uuid';
import { Message } from '../models/message.model';
import { selectMessagesByActivityId } from '../store/messages/messages.selector';
import { addMessage, setMessages } from '../store/messages/messages.actions';
import { MessageCreation } from '../models/messageCreation';
import { MessageService as Toast } from 'primeng/api';
import { APIResponseToggleRegister } from '../models/api-reponse.model';
import { updateActivitiesUserInfos } from '../../authentication/store/user.actions';
import { TAKE_1 } from 'src/app/common/constants/observables.constants';
import { selectActivitiesUserInfos } from '../../authentication/store/user.selectors';
import { ActivitiesUserInfos, AddressApiResult } from '../../authentication/models/user.model';
import { NewActivityCreation } from '../models/activity-creation.model';
import { selectConnectedAssociationId } from '../../authentication/store/user.selectors';
import * as ActivityActions from '../store/activities.actions';
import { showSuccessToast } from 'src/app/common/utils/toast.utils';

@Injectable({
  providedIn: 'root',
})
export class ActivityFacadeService {
  private _store: Store = inject(Store);
  private _toast: Toast = inject(Toast);
  private _activitiesApi: ActivitiesApiService = inject(ActivitiesApiService);

  activities$: Observable<Activity[]> = this._store.select(selectActivities);
  associationId$: Observable<UUIDTypes> = this._store.select(selectConnectedAssociationId).pipe(filter((id): id is UUIDTypes => !!id));

  getActivityThemesFromApi(): Observable<Theme[]> {
    return this._activitiesApi.getActivityThemes();
  }

  getAllActivitiesFromApi(): void {
    this._activitiesApi
      .getAllActivities()
      .pipe(
        map((activities: Activity[]) => activities.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())),
        tap((sortedActivities: Activity[]) => {
          this._store.dispatch(setActivities({ activities: sortedActivities }));
        }),
        take(TAKE_1)
      )
      .subscribe();
  }

  getActivityFromStore$(activityId: UUIDTypes): Observable<Activity> {
    return this._store.select(selectActivityById(activityId)).pipe(
      take(TAKE_1),
      switchMap(activity => {
        if (activity.description) {
          return of(activity);
        }
        return this.getActivityByIdFromApiAndDispatchStore(activityId);
      })
    );
  }

  getActivityByIdFromApiAndDispatchStore(activityId: UUIDTypes): Observable<Activity> {
    return this._activitiesApi.getActivityById(activityId).pipe(
      tap((activity: Activity): void => {
        this._store.dispatch(setActivity({ activity: activity }));
      })
    );
  }

  getIsSavedActivity(activityId: UUIDTypes): Observable<boolean> {
    return this._store.select(selectActivitiesUserInfos).pipe(
      switchMap((userActivityInfos: ActivitiesUserInfos[]): Observable<boolean> => {
        const activityInfos = userActivityInfos.find(activity => activity.activityId === activityId);
        if (!activityInfos) {
          return of(false);
        }
        return of(activityInfos.isSaved);
      })
    );
  }

  toggleSave(activityId: UUIDTypes, isSaved: boolean): void {
    this._activitiesApi
      .updateFavoriteStatus(activityId, !isSaved)
      .pipe(
        tap((apiResponse: boolean) => {
          this._store.dispatch(
            updateActivitiesUserInfos({
              activityId: activityId,
              isSaved: apiResponse,
            })
          );
        }),
        take(TAKE_1)
      )
      .subscribe();
  }

  getIsRegisteredActivity(activityId: UUIDTypes): Observable<boolean> {
    return this._store.select(selectActivitiesUserInfos).pipe(
      switchMap((userActivityInfos: ActivitiesUserInfos[]): Observable<boolean> => {
        const activityInfos = userActivityInfos.find(activity => activity.activityId === activityId);
        if (!activityInfos) {
          return of(false);
        }
        return of(activityInfos.isRegistered);
      })
    );
  }

  toggleRegister(activityId: UUIDTypes, isRegistered: boolean): void {
    this._activitiesApi
      .updateRegisterStatus(activityId, isRegistered)
      .pipe(
        tap((apiResponse: APIResponseToggleRegister) => {
          this._store.dispatch(
            updateActivityParticipants({
              id: activityId,
              participants: apiResponse.activityVoluntaryDTO,
            })
          );
          this._store.dispatch(
            updateActivitiesUserInfos({
              activityId: activityId,
              isRegistered: apiResponse.isRegistered,
            })
          );
        }),
        take(TAKE_1)
      )
      .subscribe();
  }

  getVoluntariesRegisteredToAnActivity(activityId: UUIDTypes): Observable<Participant> {
    return this._store.select(selectActivityById(activityId)).pipe(
      switchMap((activity: Activity): Observable<Participant> => {
        if (!activity) {
          return of({ current: 0, max: 0 });
        }
        return of(activity.participants);
      })
    );
  }

  getActivityMessages(activityId: string): void {
    this._store
      .select(selectMessagesByActivityId(activityId))
      .pipe(
        take(TAKE_1),
        switchMap(messages => {
          if (messages.length) {
            return of(messages);
          }

          return this._activitiesApi.getActivityMessages(activityId).pipe(
            map((fetchedMessages: Message[]) => [...fetchedMessages].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())),
            tap((sortedMessages: Message[]) => {
              this._store.dispatch(setMessages({ messages: sortedMessages }));
            })
          );
        })
      )
      .subscribe();
  }

  postActivityMessage(message: MessageCreation): void {
    this._activitiesApi
      .postActivityMessage(message)
      .pipe(
        tap((postedMessage: Message) => {
          this._store.dispatch(addMessage({ message: postedMessage }));
          showSuccessToast(this._toast);
        })
      )
      .subscribe();
  }

  searchAddress(query: string): Observable<AddressApiResult[]> {
    return this._activitiesApi.getAddressFromApi(query);
  }

  publishNewActivity(newActivity: NewActivityCreation): Observable<Activity> {
    return this._activitiesApi.publishNewActivity(newActivity).pipe(
      tap((activity: Activity): void => {
        this._store.dispatch(setActivity({ activity: activity }));
        showSuccessToast(this._toast);
      })
    );
  }

  deleteActivity(activityId: UUIDTypes): Observable<void> {
    return this.associationId$.pipe(
      take(TAKE_1),
      switchMap(() => this._activitiesApi.deleteActivity(activityId))
    );
  }

  deleteActivityAndUpdateStore(activityId: UUIDTypes): Observable<void> {
    return this.deleteActivity(activityId).pipe(
      tap(() => {
        this._store.dispatch(ActivityActions.deleteActivity({ activityId: activityId }));
      })
    );
  }
}
