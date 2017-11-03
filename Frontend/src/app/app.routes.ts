import { Routes } from '@angular/router';

import { HelloComponent } from './hello/hello.component';
import { NoContentComponent } from './no-content/no-content.component';
import { CanActivateViaAuthGuard } from './guards/can-activate-via-auth.guard';

export const ROUTES: Routes = [
  { path: '', component: HelloComponent },
  { path: 'login', component: HelloComponent },
  { path: 'administration', component: HelloComponent, canActivate: [CanActivateViaAuthGuard] },
  { path: '**', component: NoContentComponent }
];
