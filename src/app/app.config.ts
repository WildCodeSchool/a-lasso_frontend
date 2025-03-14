import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { providePrimeNG } from 'primeng/config';
import { messagesReducer } from './features/activity/store/messages/messages.reducers';
import { routes } from './app.routes';
import { PRIME_NG_FR } from './common/prime-ng.translate';
import { activitiesReducer } from './features/activity/store/activities.reducers';
import { associationsReducer } from './features/association/store/association.reducers';
import { myPreset } from './mytheme';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // provideHttpClient(withInterceptors([jwtInterceptor])),
    provideHttpClient(),
    provideAnimationsAsync(),
    provideStore({ activities: activitiesReducer, associations: associationsReducer, messages: messagesReducer }),
    provideStoreDevtools({ maxAge: 25 }),
    providePrimeNG({
      theme: {
        preset: myPreset,
      },
      translation: PRIME_NG_FR.password,
    }),
  ],
};
