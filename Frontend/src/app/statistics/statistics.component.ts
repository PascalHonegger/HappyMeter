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
import { RegularExpressions } from './../constants/regular-expressions';

@Component({
  selector: 'statistics',
  styleUrls: ['./statistics.component.css'],
  templateUrl: './statistics.component.html'
})
export class StatisticsComponent {
  public allEmotions: FullEmotion[];

  public fromDate: Date;
  public toDate: Date;

  /* Example:
  {
    name: '🎃',
    smileyCode: '1F383',
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
    smileyCode: string,
    series: Array<{
      name: string,
      value: number
    }>
  }>;

  constructor(private emotionServer: EmotionService,
              private emotionalStateServer: EmotionalStateService,
              private snackBar: MatSnackBar,
              private dateService: DateService) {
                this.fromDate = dateService.todayWithOffset(-7);
                this.toDate = dateService.todayWithOffset(0);

                this.loadEmotions();
              }

    public loadEmotions() {
      this.emotionServer.allEmotions().subscribe((data) => {
        this.allEmotions = data;
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
                smileyCode: emotion.smiley,
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
                .filter((e) => !emotionsAtDate.find((emo) => emo.smileyCode === e.smiley))) {
                  emotionsAtDate.push({
                    smileyCode: emotion.smiley,
                    createdDate: incrementingDate,
                    count: 0});
              }

              const formattedDate = this.dateService.formatDate(incrementingDate);

              // Add the count to the emoji for each date
              for (const dailyEmotion of emotionsAtDate) {
                this.chartData
                  .find((c) => c.smileyCode === dailyEmotion.smileyCode)
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
