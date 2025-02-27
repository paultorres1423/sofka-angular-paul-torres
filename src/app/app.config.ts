import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {AppProviders} from './app.providers';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {AppInterceptors} from './app.interceptors';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors(
        AppInterceptors
      )
    ),
    ...AppProviders.getProviders()
  ]
};
