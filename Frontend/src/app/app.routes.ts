import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { NoContentComponent } from './no-content/no-content.component';
import { CanActivateViaAuthGuard } from './guards/can-activate-via-auth.guard';
import { LoginComponent } from './login/login.component';
import { AdministrationComponent } from './administration/administration.component';

export const ROUTES: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'administration', component: AdministrationComponent,
    canActivate: [CanActivateViaAuthGuard] },
  { path: '**', component: NoContentComponent }
];
