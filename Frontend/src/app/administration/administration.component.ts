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
import { FullEmotion } from './../model/full-emotion.model';

@Component({
  selector: 'administration',
  styleUrls: ['./administration.component.css'],
  templateUrl: './administration.component.html'
})
export class AdministrationComponent {
  public allEmotions: FullEmotion[];

  public fromDate: Date;
  public toDate: Date;

  public chartData: any[];

  public username: string = '';
  public password: string = '';
  public usernameFormControl: FormControl = new FormControl('');
  public passwordFormControl: FormControl = new FormControl('');

  constructor(public authService: AuthService,
              private userServer: UserService,
              private emotionServer: EmotionService,
              private emotionalStateServer: EmotionalStateService,
              private snackBar: MatSnackBar,
              private router: Router) {
                this.fromDate = new Date(Date.now() - 1 * 24 * 3600 * 1000);
                this.toDate = new Date(Date.now());

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
      });
    }

    public setNewPassword() {
      this.userServer.setNewPassword(this.password).subscribe(() => {
        this.authService.password = this.password;
      });
    }

    public logout() {
      this.authService.clearCredentials();
      this.snackBar.open('Anmelden erfolgreich');
      this.router.navigate(['']);
    }

    public tryRefreshChart() {
      // Ensure dates are valid
      if (this.fromDate > this.toDate) {
        this.snackBar.open('Das Start-Datum muss kleiner als das Bis-Datum sein', 'Ok');
      } else {
        this.emotionalStateServer
          .allEmotionalStatesWithinRange(this.fromDate, this.toDate)
          .subscribe((data) => {
            this.chartData = [];
            for (const d of data.sort(
                (a, b) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime())) {
              const emojiCode = this.allEmotions.find((e) => e.id === d.emotionId).smiley;
              const emoji = String.fromCodePoint(parseInt(emojiCode, 16));
              const date = new Date(d.createdDate).toISOString().substring(0, 10);

              const existingChartItem = this.chartData.find((c) => c.name === emoji);
              if (existingChartItem) {
                const existingDateItem = existingChartItem.series.find((e) => e.name === date);
                if (existingDateItem) {
                  existingDateItem.value += 1;
                } else {
                  existingChartItem.series.push({ name: date, value: 1});
                }
              } else {
                this.chartData.push({ name: emoji, series: [
                  {
                    name: date,
                    value: 1
                  }
                ]});
              }
            }
          });
      }
    }

}
