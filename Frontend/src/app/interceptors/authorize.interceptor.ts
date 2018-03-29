import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';

import { AuthService } from './../services/auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthorizeInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) {}

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({
      setHeaders: {
        username: request.headers.get('username') || this.auth.username,
        password: request.headers.get('password') || this.auth.password
      }
    });

    return next.handle(request);
  }
}
