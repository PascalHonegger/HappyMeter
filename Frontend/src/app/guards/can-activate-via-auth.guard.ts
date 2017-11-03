import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthService } from './../services/auth.service';

@Injectable()
export class CanActivateViaAuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) {}

  public canActivate() {
    const usernameDefined = this.authService.username != null && this.authService.username !== '';

    if (usernameDefined) {
      return true;
    }

    this.router.navigate(['login']);

    return false;
  }
}
