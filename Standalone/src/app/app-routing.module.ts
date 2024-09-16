import {
  Routes,
} from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ExternalApiComponent } from './pages/external-api/external-api.component';
import { ErrorComponent } from './pages/error/error.component';
import { authGuardFn } from '@auth0/auth0-angular';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { FileDownloadComponent } from './file-download/file-download.component';
import { FileViewComponent } from './file-view/file-view.component';
import { ViewChildren } from '@angular/core';
import { ViewComponent } from './view/view.component';

export const routes: Routes = [
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuardFn],
  },
  {
    path: 'external-api',
    component: ExternalApiComponent,
    canActivate: [authGuardFn],
  },
  {
    path: 'error',
    component: ErrorComponent,
  },
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
  },
  { path: 'name/:name', component: ViewComponent }, // added
  { path: 'upload', component: FileUploadComponent },
  { path: 'download', component: FileDownloadComponent },
  { path: 'file/:file', component: FileViewComponent }, // added
  
];
