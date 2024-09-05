import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ViewpageComponent } from './viewpage/viewpage.component';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { AddpageComponent } from './addpage/addpage.component';
import { FormsModule } from '@angular/forms';
import { ViewfileComponent } from './viewfile/viewfile.component';
import { MolstarComponent } from './molstar/molstar.component';

@NgModule({
  declarations: [
    AppComponent,
    ViewpageComponent,
    AddpageComponent,
    ViewfileComponent,
    MolstarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
    
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch()),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
