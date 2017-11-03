import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';

import { AuthService } from './../services/auth.service';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService, private router: Router, private dialog: MatDialog) {}

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).do(() => undefined, (event) => {
      if (event instanceof HttpErrorResponse) {
        console.warn('Received not OK response with status ' + event.status, event);
        if (event.status === 400) {
          // Ignore requests concerning wrong user input
          return;
        }

        if (request.url.endsWith('TestCredentials')) {
          // Ignore login request
          return;
        }

        if (event.status === 401) {
          this.auth.clearCredentials();
          this.router.navigate(['login']);
          return;
        }

        this.dialog.open(ErrorDialogComponent);
      }
    });
  }
}
