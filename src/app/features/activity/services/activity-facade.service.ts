import { Injectable, inject } from '@angular/core';
import { Activity, Theme } from '../models/activity.model';
import { map, Observable, of, switchMap, take, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectActivities, selectActivityById } from '../store/activities.selector';
import { setActivities, setActivity, updateActivityParticipants, updateFavoriteStatus, updateRegisterStatus } from '../store/activities.actions';
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

@Injectable({
  providedIn: 'root',
})
export class ActivityFacadeService {
  private _store: Store = inject(Store);
  private _toast: Toast = inject(Toast);
  private _activitiesApi: ActivitiesApiService = inject(ActivitiesApiService);
  activities$: Observable<Activity[]> = this._store.select(selectActivities);

  getActivityThemesFromApi(): Observable<Theme[]> {
    return this._activitiesApi.getActivityThemes();
  }

  getAllActivitiesFromApi(): void {
    this._activitiesApi
      .getAllActivities()
      .pipe(
        tap((activities: Activity[]) => {
          this._store.dispatch(setActivities({ activities }));
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

  toggleSave(activityId: UUIDTypes, isSaved: boolean): void {
    this._activitiesApi
      .updateFavoriteStatus(activityId, !isSaved)
      .pipe(
        tap((apiResponse: boolean) => {
          this._store.dispatch(
            updateFavoriteStatus({
              id: activityId,
              isSaved: apiResponse,
            })
          );
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

  toggleRegister(activityId: UUIDTypes, isRegistered: boolean): void {
    this._activitiesApi
      .updateRegisterStatus(activityId, !isRegistered)
      .pipe(
        tap((apiResponse: APIResponseToggleRegister) => {
          this._store.dispatch(
            updateRegisterStatus({
              id: activityId,
              isRegistered: apiResponse.isRegistered,
            })
          );
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
          this._toast.add({
            severity: 'success',
            summary: 'Message envoyé !',
          });
        })
      )
      .subscribe();
  }
}
