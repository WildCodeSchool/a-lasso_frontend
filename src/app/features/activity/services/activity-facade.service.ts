import { Injectable, inject } from '@angular/core';
import { Activity } from '../models/activity.model';
import { Observable, of, switchMap, take, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectActivities, selectActivityById, selectThemes } from '../store/activities.selector';
import { setActivities, setThemes, updateActivityParticipants, updateFavoriteStatus, updateRegisterStatus } from '../store/activities.actions';
import { ActivitiesApiService } from './activities-api.service';
import { UUIDTypes } from 'uuid';
import { Message } from '../models/message.model';
import { selectMessagesByActivityId } from '../store/messages/messages.selector';
import { addMessage, setMessages } from '../store/messages/messages.actions';
import { MessageCreation } from '../models/messageCreation';
import { MessageService as Toast } from 'primeng/api';
import { APIResponseToggleRegister } from '../models/api-reponse.model';
import { Theme } from '../models/theme.model';

@Injectable({
  providedIn: 'root',
})
export class ActivityFacadeService {
  store: Store = inject(Store);
  toast: Toast = inject(Toast);
  activitiesApi: ActivitiesApiService = inject(ActivitiesApiService);

  themes$: Observable<Theme[]> = this.store.select(selectThemes);
  activities$: Observable<Activity[]> = this.store.select(selectActivities);

  getActivityThemesFromApi(): void {
    this.activitiesApi
      .getActivityThemes()
      .pipe(
        tap((themes: Theme[]) => {
          this.store.dispatch(setThemes({ themes }));
        }),
        take(1)
      )
      .subscribe();
  }

  getAllActivitiesFromApi(): void {
    this.activitiesApi
      .getAllActivities()
      .pipe(
        tap((activities: Activity[]) => {
          this.store.dispatch(setActivities({ activities }));
        }),
        take(1)
      )
      .subscribe();
  }

  toggleFavorite(activityId: UUIDTypes, isFavorite: boolean): void {
    this.activitiesApi
      .updateFavoriteStatus(activityId, !isFavorite)
      .pipe(
        tap((apiResponse: boolean) =>
          this.store.dispatch(
            updateFavoriteStatus({
              id: activityId,
              isFavorite: apiResponse,
            })
          )
        ),
        take(1)
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
        }),
        take(1)
      )
      .subscribe();
  }

  getActivityMessages(activityId: string): void {
    this.store
      .select(selectMessagesByActivityId(activityId))
      .pipe(
        take(1),
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
