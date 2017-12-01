import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { EmotionalStateService } from './../services/emotional-state.service';
import { DateService } from './../services/date.service';
import { CommentWithDetails } from './../model/comment-with-details.model';
import { DataParserService } from './../services/data-parser.service';

@Component({
  selector: 'statistics',
  styleUrls: ['./statistics.component.scss'],
  templateUrl: './statistics.component.html'
})
export class StatisticsComponent {
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

  constructor(private emotionalStateServer: EmotionalStateService,
              private snackBar: MatSnackBar,
              private dateService: DateService,
              private dataParserService: DataParserService) {
                this.fromDate = dateService.todayWithOffset(-7);
                this.toDate = dateService.todayWithOffset(0);
              }

    public tryRefreshChart() {
      // Ensure dates are valid
      if (this.fromDate > this.toDate) {
        this.snackBar.open('Das Start-Datum muss kleiner als das Bis-Datum sein', 'Ok');
      } else {
        this.emotionalStateServer
          .groupedEmotionalStatesWithinRange(
            this.fromDate, this.dateService.dateWithOffset(this.toDate, 1))
          .subscribe((data) => {
            this.comments = this.dataParserService.getCommentsWithDetails(data);

            this.chartData = [];

            // Iterate through all dates between the start and end date
            let incrementingDate = new Date(this.fromDate.getTime());
            incrementingDate.setHours(0, 0, 0, 0);
            while (incrementingDate <= this.toDate) {
              this.chartData.push({
                name: this.dateService.formatDate(incrementingDate),
                series: []
              });

              // Increase the current date
              incrementingDate = this.dateService.dateWithOffset(incrementingDate, 1);
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
