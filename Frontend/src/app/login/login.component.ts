import { Component } from '@angular/core';

import { EmotionalStateService } from './../services/emotional-state.service';
import { EmotionService } from './../services/emotion.service';
import { CalculationService } from './../services/calculation.service';
import { CustomTitleService } from './../services/custom-title.service';
import { EmotionalState } from './../model/emotional-state.model';
import { Emotion } from './../model/emotion.model';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { UserService } from './../services/user.service';
import { AuthService } from './../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'login',
  styleUrls: ['./login.component.css'],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  public username: string = '';
  public password: string = '';
  public usernameFormControl: FormControl = new FormControl('');
  public passwordFormControl: FormControl = new FormControl('');

  constructor(private userServer: UserService,
              private authService: AuthService,
              private snackBar: MatSnackBar,
              private router: Router) { }

  public login() {
    this.userServer.testCredentials(this.username, this.password)
      .subscribe(() => {
        this.authService.username = this.username;
        this.authService.password = this.password;
        this.router.navigate(['administration']);
      }, (error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.snackBar.open('Invalide Anmeldedaten', 'Ok');
        }
      });
  }
}
