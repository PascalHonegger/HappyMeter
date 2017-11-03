import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { AuthService } from './../services/auth.service';

@Injectable()
export class CanActivateViaAuthGuard implements CanActivate {

  constructor(private authService: AuthService) {}

  public canActivate() {
    return this.authService.token != null;
  }
}
