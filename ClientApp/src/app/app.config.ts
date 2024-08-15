import { provideRouter, withComponentInputBinding } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];


export const appConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding())
  ]
};
