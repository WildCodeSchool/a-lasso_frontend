import { Injectable, inject } from '@angular/core';
import { Activity } from '../models/activity.model';
import { Observable, of, switchMap, take, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectActivities } from '../store/activities.selector';
import { setActivities, updateFavoriteStatus } from '../store/activities.actions';
import { ActivitiesApiService } from './activities-api.service';
import { UUIDTypes } from 'uuid';
import { Message } from '../models/message.model';
import { selectMessagesByActivityId } from '../store/messages/messages.selector';
import { setMessages } from '../store/messages/messages.actions';
import { MessageCreation } from '../models/messageCreation';

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
    // Send to Back
    this.activitiesApi
      .updateFavoriteStatus(activityId, isFavorite)
      .pipe(
        tap((apiResponse: boolean) =>
          apiResponse
            ? this.store.dispatch(
                updateFavoriteStatus({
                  id: activityId,
                  isFavorite: !isFavorite,
                })
              )
            : 'TODO : ALERT NOTIFCATION FAILED'
        ),
        take(1)
      )
      .subscribe();
  }

  getActivityMessages(activityId: string): Observable<Message[]> {
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
