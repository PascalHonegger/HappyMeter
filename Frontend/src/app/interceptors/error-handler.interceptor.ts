import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';

import { AuthService } from './../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService, private router: Router) {}

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).do((event) => {
      if (event instanceof HttpResponse && !event.ok) {
        console.warn('Received not OK response with status ' + event.status, event);
        if (event.status === 400) {
          // Ignore requests concerning wrong user input
          return;
        }

        if (request.url.endsWith('login')) {
          // Ignore login request
          return;
        }

        if (event.status === 401) {
          this.router.navigate(['login']);
          return;
        }

        // TODO display popup with error content for further assistance
      }
    });
  }
}
