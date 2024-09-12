import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { HomeContentComponent } from './../../components/home-content/home-content.component';
import { HeroComponent } from './../../components/hero/hero.component';
import { LoadingComponent } from './../../components/loading/loading.component';
import { AsyncPipe, NgIf } from '@angular/common';
import { FileUploadComponent } from 'src/app/file-upload/file-upload.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [
    HomeContentComponent,
    HeroComponent,
    LoadingComponent,
    AsyncPipe,
    NgIf,
    FileUploadComponent // added
  ]
})
export class HomeComponent {
  constructor(public auth: AuthService) {}
}
