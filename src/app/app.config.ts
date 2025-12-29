import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './Interceptors/auth-interceptor';
import { NgxSpinnerModule } from "ngx-spinner";
import { lodingInterceptor } from './Interceptors/loding-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor, lodingInterceptor])
    ),
    importProvidersFrom(NgxSpinnerModule)

  ]
};
