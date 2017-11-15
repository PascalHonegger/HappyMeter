import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatSnackBar, MatDialog } from '@angular/material';

import { EmotionalStateService } from './../services/emotional-state.service';
import { EmotionService } from './../services/emotion.service';
import { UserService } from './../services/user.service';
import { AuthService } from './../services/auth.service';
import { DateService } from './../services/date.service';
import { FullEmotion } from './../model/full-emotion.model';
import { SelectEmojiDialogComponent } from './../select-emoji-dialog/select-emoji-dialog.component';

@Component({
  selector: 'administration',
  styleUrls: ['./administration.component.css'],
  templateUrl: './administration.component.html'
})
export class AdministrationComponent {
  public allEmotions: FullEmotion[];

  public fromDate: Date;
  public toDate: Date;

  /* Example:
  {
    name: '🎃',
    series: [
      {
        name: '2017-11-07',
        value: 12
      },
      {
        name: '2017-11-08',
        value: 4
      }
    ]
  }
  */
  public chartData: Array<
  {
    name: string,
    emotionId: number,
    series: Array<{
      name: string,
      value: number
    }>
  }>;

  public username: string = '';
  public password: string = '';
  public repeatedPassword: string = '';
  public usernameFormControl: FormControl = new FormControl('');
  public passwordFormControl: FormControl = new FormControl('');

  constructor(public authService: AuthService,
              private userServer: UserService,
              private emotionServer: EmotionService,
              private emotionalStateServer: EmotionalStateService,
              private snackBar: MatSnackBar,
              private router: Router,
              private dialog: MatDialog,
              private dateService: DateService) {
                this.fromDate = dateService.todayWithOffset(-1);
                this.toDate = dateService.todayWithOffset(0);

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

    public tryRefreshChart() {
      // Ensure dates are valid
      if (this.fromDate > this.toDate) {
        this.snackBar.open('Das Start-Datum muss kleiner als das Bis-Datum sein', 'Ok');
      } else {
        this.emotionalStateServer
          .groupedEmotionalStatesWithinRange(this.fromDate, this.toDate)
          .subscribe((data) => {
            // Create an entry for each emotion / emoji
            this.chartData = this.allEmotions.map((emotion) => (
              {
                name: String.fromCodePoint(parseInt(emotion.smiley, 16)),
                emotionId: emotion.id,
                series: []
              }));

            // Iterate through all dates between the start and end date
            const incrementingDate = new Date(this.fromDate.getTime());
            incrementingDate.setHours(0, 0, 0, 0);
            while (incrementingDate <= this.toDate) {
              // Load all emotion-groups which belong to this date
              const emotionsAtDate = data.filter((d) => {
                const parsed = new Date(d.createdDate);
                parsed.setHours(0, 0, 0, 0);
                return parsed.getTime() === incrementingDate.getTime();
              });

              // For each emotion which has no emotion at the date, add one with a count of 0
              for (const emotion of this.allEmotions
                .filter((e) => !emotionsAtDate.find((emo) => emo.emotionId === e.id))) {
                  emotionsAtDate.push({
                    emotionId: emotion.id,
                    createdDate: incrementingDate,
                    count: 0});
              }

              const formattedDate = this.dateService.formatDate(incrementingDate);

              // Add the count to the emoji for each date
              for (const dailyEmotion of emotionsAtDate) {
                this.chartData
                  .find((c) => c.emotionId === dailyEmotion.emotionId)
                  .series.push({
                    name: formattedDate,
                    value: dailyEmotion.count
                  });
              }

              // Increase the current date
              this.dateService.addDaysToDate(incrementingDate, 1);
            }
          });
      }
    }

}
