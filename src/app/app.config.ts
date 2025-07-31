import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { authInterceptor } from './shared/authInteceptor';


export const appConfig: ApplicationConfig = {
  providers: [
   // provideBrowserGlobalErrorListeners(),
   // provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch(),
      withInterceptorsFromDi(),  // pega outros interceptors do DI
      withInterceptors([authInterceptor]) // nosso interceptor que adiciona o Bearer
    )
  ]
};
