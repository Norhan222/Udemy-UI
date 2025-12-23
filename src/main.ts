import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { DashboardLayout } from './app/Components/Dashboard/dashboard-layout/dashboard-layout';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
