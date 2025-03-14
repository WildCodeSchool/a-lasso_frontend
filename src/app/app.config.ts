import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import { activitiesReducer } from './features/activity/store/activities.reducers';
import { myPreset } from './mytheme';
import { associationsReducer } from './features/association/store/association.reducers';
import { messagesReducer } from './features/activity/store/messages/messages.reducers';
import { PRIME_NG_FR } from './common/prime-ng.translate';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([jwtInterceptor])),
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
