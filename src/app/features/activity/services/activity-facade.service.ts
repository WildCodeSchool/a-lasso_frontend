import { Injectable, inject } from '@angular/core';
import { Activity, Theme } from '../models/activity.model';
import { Observable, of, switchMap, take, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectActivities, selectActivityById } from '../store/activities.selector';
import { setActivities, updateActivityParticipants, updateFavoriteStatus, updateRegisterStatus } from '../store/activities.actions';
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
  store: Store = inject(Store);
  toast: Toast = inject(Toast);
  activitiesApi: ActivitiesApiService = inject(ActivitiesApiService);
  activities$: Observable<Activity[]> = this.store.select(selectActivities);

  getActivityThemesFromApi(): Observable<Theme[]> {
    return this.activitiesApi.getActivityThemes();
  }

  getAllActivitiesFromApi(): void {
    this.activitiesApi
      .getAllActivities()
      .pipe(
        tap((activities: Activity[]) => {
          this.store.dispatch(setActivities({ activities }));
        }),
        take(TAKE_1)
      )
      .subscribe();
  }

  toggleSave(activityId: UUIDTypes, isSaved: boolean): void {
    this.activitiesApi
      .updateFavoriteStatus(activityId, !isSaved)
      .pipe(
        tap((apiResponse: boolean) => {
          this.store.dispatch(
            updateFavoriteStatus({
              id: activityId,
              isSaved: apiResponse,
            })
          );
          this.store.dispatch(
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
    this.activitiesApi
      .updateRegisterStatus(activityId, !isRegistered)
      .pipe(
        tap((apiResponse: APIResponseToggleRegister) => {
          this.store.dispatch(
            updateRegisterStatus({
              id: activityId,
              isRegistered: apiResponse.isRegistered,
            })
          );
          this.store.dispatch(
            updateActivityParticipants({
              id: activityId,
              participants: apiResponse.activityVoluntaryDTO,
            })
          );
          this.store.dispatch(
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
    this.store
      .select(selectMessagesByActivityId(activityId))
      .pipe(
        take(TAKE_1),
        switchMap(messages => {
          if (messages.length) {
            return of(messages);
          }
          return this.activitiesApi.getActivityMessages(activityId).pipe(
            tap((fetchedMessages: Message[]): void => {
              fetchedMessages.sort((a: Message, b: Message): number => new Date(a.date).getTime() - new Date(b.date).getTime());
              this.store.dispatch(setMessages({ messages: fetchedMessages }));
            })
          );
        })
      )
      .subscribe();
  }

  getActivityFromStore$(activityId: UUIDTypes): Observable<Activity> {
    return this.store.select(selectActivityById(activityId));
  }

  postActivityMessage(message: MessageCreation): void {
    this.activitiesApi
      .postActivityMessage(message)
      .pipe(
        tap((postedMessage: Message) => {
          this.store.dispatch(addMessage({ message: postedMessage }));
          this.toast.add({
            severity: 'success',
            summary: 'Message envoyé !',
          });
        })
      )
      .subscribe();
  }
}
