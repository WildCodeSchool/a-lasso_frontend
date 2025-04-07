import { Injectable, inject } from '@angular/core';
import { Activity } from '../models/activity.model';
import { Observable, of, switchMap, take, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectActivities, selectActivityById } from '../store/activities.selector';
import { setActivities, updateActivityParticipants, updateFavoriteStatus, updateRegisterStatus } from '../store/activities.actions';
import { ActivitiesApiService } from './activities-api.service';
import { UUIDTypes } from 'uuid';
import { Message } from '../models/message.model';
import { selectMessagesByActivityId } from '../store/messages/messages.selector';
import { setMessages } from '../store/messages/messages.actions';
import { MessageCreation } from '../models/messageCreation';
import { APIResponseToggleRegister } from '../models/api-reponse.model';

@Injectable({
  providedIn: 'root',
})
export class ActivityFacadeService {
  store: Store = inject(Store);
  activitiesApi: ActivitiesApiService = inject(ActivitiesApiService);
  activities$: Observable<Activity[]> = this.store.select(selectActivities);

  getAllActivities(): void {
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
    // TODO : add a Toest notifcation to inform user he is now registered to the acitivty !
  }

  getActivityMessages(activityId: UUIDTypes): Observable<Message[]> {
    //TODO: récupérer les messages du store
    // si pas dans store requete API ?
    // oui mais si messages envoyés depuis stockage dans le store on
    // les récupère quand ???

    return this.store.select(selectMessagesByActivityId(activityId)).pipe(
      take(1),
      switchMap(messages => {
        if (messages.length) {
          return of(messages);
        }
        // If not found in store fetch from API
        return this.activitiesApi.getActivityMessages(activityId).pipe(
          tap((fetchedMessages: Message[]): void => {
            fetchedMessages.sort((a: Message, b: Message): number => new Date(a.date).getTime() - new Date(b.date).getTime());
            this.store.dispatch(setMessages({ messages: fetchedMessages }));
          })
        );
      })
    );
  }

  getActivity(activityId: UUIDTypes): Observable<Activity | null> {
    return this.store.select(selectActivityById(activityId));
  }

  postActivityMessage(message: MessageCreation): void {
    this.activitiesApi
      .postActivityMessage(message)
      .pipe(
        tap((postMessage: Message) => {
          this.store.dispatch(setMessages({ messages: [postMessage] }));
        })
      )
      .subscribe();
  }
}
