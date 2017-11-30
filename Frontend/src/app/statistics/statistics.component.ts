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
import { CommentWithDetails } from './../model/comment-with-details.model';

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
    name: '2017-11-07',
    series: [
      {
        name: '🎃',
        value: 12
      },
      {
        name: '😭',
        value: 4
      }
    ]
  }
  */
  public chartData: Array<
  {
    name: string,
    series: Array<{
      name: string,
      value: number
    }>
  }>;

  public comments: CommentWithDetails[];

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
            this.comments = data
              .map((d) =>
                d.emotionalStates
                  .filter((e) => e.comments)
                  .map((e) =>
                    e.comments.map<CommentWithDetails>((c) => (
                      {
                        emotionalStateId: c.id,
                        comment: c.comment,
                        postDate: c.postDate,
                        emojiCode: e.smileyCode
                      }))))
              .reduce((a, b) => a.concat(b))
              .reduce((a, b) => a.concat(b));

            this.chartData = [];

            // Iterate through all dates between the start and end date
            const incrementingDate = new Date(this.fromDate.getTime());
            incrementingDate.setHours(0, 0, 0, 0);
            while (incrementingDate <= this.toDate) {
              this.chartData.push({
                name: this.dateService.formatDate(incrementingDate),
                series: []
              });

              // Increase the current date
              this.dateService.addDaysToDate(incrementingDate, 1);
            }

            for (const emojisPerDate of data) {
              const formattedName = this.dateService.formatDate(new Date(emojisPerDate.date));
              const chartItem = this.chartData.find((c) => c.name === formattedName);
              chartItem.series = emojisPerDate.emotionalStates.map((e) => (
                {
                  name: String.fromCodePoint(parseInt(e.smileyCode, 16)),
                  value: e.count
                }));
            }
          });
      }
    }

}
