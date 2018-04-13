import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { NoContentComponent } from './no-content/no-content.component';
import { CanActivateViaAuthGuard } from './guards/can-activate-via-auth.guard';
import { LoginComponent } from './login/login.component';
import { AdministrationComponent } from './administration/administration.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { FaceComponent } from './face/face.component';
import { FacialRecognitionComponent } from './facial-recognition/facial-recognition.component';

export const ROUTES: Routes = [
  { path: '', component: HomeComponent },
  { path: 'statistics', component: StatisticsComponent },
  { path: 'face', component: FaceComponent },
  { path: 'login', component: LoginComponent },
  { path: 'administration', component: AdministrationComponent,
    canActivate: [CanActivateViaAuthGuard] },
  { path: '**', component: NoContentComponent }
];
