import { Routes } from '@angular/router';

import { HelloComponent } from './hello/hello.component';
import { NoContentComponent } from './no-content/no-content.component';

export const ROUTES: Routes = [
  { path: '', component: HelloComponent },
  { path: '**', component: NoContentComponent }
];
