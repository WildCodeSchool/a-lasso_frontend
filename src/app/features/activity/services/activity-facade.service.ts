import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { MessageService as Toast } from 'primeng/api';
import { combineLatest, map, Observable, of, switchMap, take, tap } from 'rxjs';
import { TAKE_1 } from 'src/app/common/constants/observables.constants';
import { showInfoToast, showSuccessToast } from 'src/app/common/utils/toast.utils';
import { UUIDTypes } from 'uuid';
import { ActivitiesUserInfos, AddressApiResult } from '../../authentication/models/user.model';
import { UserActions } from '../../authentication/store/user.actions';
import { UserSelectors } from '../../authentication/store/user.selectors';
import { ActivityFormData } from '../models/activity-creation.model';
import { Activity, Participant, Theme } from '../models/activity.model';
import { APIResponseToggleRegister } from '../models/api-reponse.model';
import { Message } from '../models/message.model';
import { MessageCreation } from '../models/messageCreation';
import { ActivitiesActions } from '../store/activities.actions';
import { ActivitiesSelectors } from '../store/activities.selectors';
import { MessagesActions } from '../store/messages/messages.actions';
import { MessagesSelectors } from '../store/messages/messages.selectors';
import { ActivitiesApiService } from './activities-api.service';

@Injectable({
  providedIn: 'root',
})
export class ActivityFacadeService {
  private _store: Store = inject(Store);
  private _toast: Toast = inject(Toast);
  private _activitiesApi: ActivitiesApiService = inject(ActivitiesApiService);

  activities$: Observable<Activity[]> = this._store.select(ActivitiesSelectors.selectActivities);
  associationId$: Observable<UUIDTypes | null> = this._store.select(UserSelectors.selectConnectedAssociationId);
  voluntaryId$: Observable<UUIDTypes | null> = this._store.select(UserSelectors.selectConnectedVoluntaryId);

  registeredActivityIds$: Observable<UUIDTypes[]> = this._store
    .select(UserSelectors.selectActivitiesUserInfos)
    .pipe(map(infos => infos.filter(info => info.isRegistered).map(info => info.activityId)));

  getActivityThemesFromApi(): Observable<Theme[]> {
    return this._activitiesApi.getActivityThemes();
  }

  getFutureActivitiesFromApi(): void {
    this._fetchActivities(
      () => this._activitiesApi.getFutureActivities(),
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  getPastActivitiesFromApi(): void {
    this._activitiesApi
      .getPastActivities()
      .pipe(
        tap((activities: Activity[]) => {
          this._store.dispatch(ActivitiesActions.setActivities({ activities }));

          activities.forEach(activity => {
            this._store.dispatch(
              UserActions.updateActivitiesUserInfos({
                activityId: activity.id,
                isRegistered: true,
              })
            );
          });
        }),
        take(1)
      )
      .subscribe();
  }

  getSavedActivitiesFromApi(): void {
    combineLatest([this._activitiesApi.getFutureActivities(), this._activitiesApi.getPastActivities()])
      .pipe(
        map(([future, past]) => [...future, ...past]),
        tap((all: Activity[]) => {
          this._store.dispatch(ActivitiesActions.setActivities({ activities: all }));
        }),
        take(1)
      )
      .subscribe();
  }

  getActivityFromStore$(activityId: UUIDTypes): Observable<Activity> {
    return this._store.select(ActivitiesSelectors.selectActivityById(activityId)).pipe(
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
        this._store.dispatch(ActivitiesActions.setActivity({ activity: activity }));
      })
    );
  }

  getIsSavedActivity(activityId: UUIDTypes): Observable<boolean> {
    return this._store.select(UserSelectors.selectActivitiesUserInfos).pipe(
      switchMap((userActivityInfos: ActivitiesUserInfos[]): Observable<boolean> => {
        const activityInfos = userActivityInfos.find(activity => activity.activityId === activityId);
        if (!activityInfos) {
          return of(false);
        }
        return of(activityInfos.isSaved);
      })
    );
  }

  refreshActivitiesByAssociation(associationId: UUIDTypes): void {
    this._activitiesApi.getActivitiesByAssociationId(associationId).subscribe(activities => {
      this._store.dispatch(ActivitiesActions.setActivities({ activities }));
    });
  }

  toggleSave(activityId: UUIDTypes, isSaved: boolean): void {
    this._activitiesApi
      .updateFavoriteStatus(activityId, !isSaved)
      .pipe(
        take(TAKE_1),
        tap({
          next: (isFollowApiResponse: boolean) => {
            this._store.dispatch(
              UserActions.updateActivitiesUserInfos({
                activityId: activityId,
                isSaved: isFollowApiResponse,
              })
            );
          },
        })
      )
      .subscribe({
        error: () => {
          showInfoToast(this._toast);
        },
      });
  }

  getIsRegisteredActivity(activityId: UUIDTypes): Observable<boolean> {
    return this._store.select(UserSelectors.selectActivitiesUserInfos).pipe(
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
            ActivitiesActions.updateActivityParticipants({
              id: activityId,
              participants: apiResponse.activityParticipantsRequestDTO,
            })
          );
          this._store.dispatch(
            UserActions.updateActivitiesUserInfos({
              activityId: activityId,
              isRegistered: apiResponse.isRegistered,
            })
          );

          if (apiResponse.isRegistered) {
            showSuccessToast(this._toast);
          } else {
            showInfoToast(this._toast, 'Inscription annulée.');
          }
        }),
        take(TAKE_1)
      )
      .subscribe();
  }

  getVoluntariesRegisteredToAnActivity(activityId: UUIDTypes): Observable<Participant> {
    return this._store.select(ActivitiesSelectors.selectActivityById(activityId)).pipe(
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
      .select(MessagesSelectors.selectMessagesByActivityId(activityId))
      .pipe(
        take(TAKE_1),
        switchMap(messages => {
          if (messages.length) {
            return of(messages);
          }

          return this._activitiesApi.getActivityMessages(activityId).pipe(
            map((fetchedMessages: Message[]) => [...fetchedMessages].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())),
            tap((sortedMessages: Message[]) => {
              this._store.dispatch(MessagesActions.setMessages({ messages: sortedMessages }));
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
          this._store.dispatch(MessagesActions.addMessage({ message: postedMessage }));
        })
      )
      .subscribe();
  }

  searchAddress(query: string): Observable<AddressApiResult[]> {
    return this._activitiesApi.getAddressFromApi(query);
  }

  saveActivity(activity: ActivityFormData): Observable<Activity> {
    return this._activitiesApi.saveActivity(activity).pipe(
      tap((activity: Activity): void => {
        this._store.dispatch(ActivitiesActions.setActivity({ activity: activity }));
        showSuccessToast(this._toast);
      })
    );
  }

  deleteActivityAndUpdateStore(activityId: UUIDTypes): Observable<void> {
    return this._deleteActivity(activityId).pipe(
      tap(() => {
        this._store.dispatch(ActivitiesActions.deleteActivity({ activityId: activityId }));
      })
    );
  }

  private _deleteActivity(activityId: UUIDTypes): Observable<void> {
    return this.associationId$.pipe(
      take(TAKE_1),
      switchMap(() => this._activitiesApi.deleteActivity(activityId))
    );
  }

  private _fetchActivities(apiCall: () => Observable<Activity[]>, sortFn: (a: Activity, b: Activity) => number): void {
    apiCall()
      .pipe(
        map((activities: Activity[]) => [...activities].sort(sortFn)),
        tap((sortedActivities: Activity[]) => {
          this._store.dispatch(ActivitiesActions.setActivities({ activities: sortedActivities }));
        }),
        take(TAKE_1)
      )
      .subscribe();
  }
}
