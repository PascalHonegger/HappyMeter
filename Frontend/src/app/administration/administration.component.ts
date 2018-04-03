import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatSnackBar, MatDialog } from '@angular/material';

import { EmotionalStateService } from './../services/emotional-state.service';
import { EmotionService } from './../services/emotion.service';
import { UserService } from './../services/user.service';
import { AuthService } from './../services/auth.service';
import { FullEmotion } from './../model/full-emotion.model';
import { SelectEmojiDialogComponent } from './../select-emoji-dialog/select-emoji-dialog.component';
import { RegularExpressions } from './../constants/regular-expressions';

@Component({
  selector: 'administration',
  styleUrls: ['./administration.component.css'],
  templateUrl: './administration.component.html'
})
export class AdministrationComponent {
  public allEmotions: FullEmotion[];

  public username: string = '';
  public password: string = '';
  public repeatedPassword: string = '';
  public usernameFormControl: FormControl = new FormControl('');
  public passwordFormControl: FormControl = new FormControl('');

  public get pattern() {
    return RegularExpressions.noFunkyCharactersRegex;
  }

  constructor(public authService: AuthService,
              private userServer: UserService,
              private emotionServer: EmotionService,
              private emotionalStateServer: EmotionalStateService,
              private snackBar: MatSnackBar,
              private router: Router,
              private dialog: MatDialog) {
                this.loadEmotions();

                this.username = this.authService.username;
              }

    public loadEmotions() {
      this.emotionServer.allEmotions().subscribe((data) => {
        this.allEmotions = data;
      });
    }

    public invertActive(emotion: FullEmotion) {
      this.emotionServer.setActiveForEmotion(emotion.id, !emotion.isActive).subscribe(() => {
        emotion.isActive = !emotion.isActive;
      });
    }

    public setNewUsername() {
      this.userServer.setNewUsername(this.username).subscribe(() => {
        this.authService.username = this.username;
        this.snackBar.open('Benutzername geändert', 'Ok');
      }, (error: HttpErrorResponse) => {
        if (error.status === 400) {
          this.snackBar.open('Der neu gewählte Benutzername existiert bereits', 'Ok');
        }
      });
    }

    public setNewPassword() {
      if (this.password !== this.repeatedPassword) {
        this.snackBar.open('Die Passwörter stimmen nicht überein', 'Ok');
        return;
      }
      this.userServer.setNewPassword(this.password).subscribe(() => {
        this.authService.password = this.password;
        this.password = '';
        this.repeatedPassword = '';
        this.snackBar.open('Passwort geändert', 'Ok');
      });
    }

    public logout() {
      this.authService.clearCredentials();
      this.snackBar.open('Erfolgreich abgemeldet', null, { duration: 3000 });
      this.router.navigate(['']);
    }

    public openSetEmojiDialog(emotionId: number) {
      this.dialog
        .open(SelectEmojiDialogComponent)
        .afterClosed()
        .subscribe((emojiCode) => {
          if (emojiCode) {
            this.emotionServer
              .setSmileyForEmotion(emotionId, emojiCode).subscribe(
                () => this.loadEmotions(),
                (error: HttpErrorResponse) => {
                  if (error.status === 400) {
                    this.snackBar.open('Das neu gewählte Emoji wird bereits verwendet', 'Ok');
                  }
                });
          } else {
            // Cancelled
          }
        });
    }

    public openNewEmojiDialog() {
      this.dialog
      .open(SelectEmojiDialogComponent)
      .afterClosed()
      .subscribe((emojiCode) => {
        if (emojiCode) {
          this.emotionServer
            .addNewEmotion(emojiCode).subscribe(
              () => this.loadEmotions(),
              (error: HttpErrorResponse) => {
                if (error.status === 400) {
                  this.snackBar.open('Das gewählte Emoji wird bereits verwendet', 'Ok');
                }
              });
        } else {
          // Cancelled
        }
      });
    }

}
