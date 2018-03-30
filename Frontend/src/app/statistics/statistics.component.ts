import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { EmotionalStateService } from './../services/emotional-state.service';
import { DateService } from './../services/date.service';
import { CommentWithDetails } from './../model/comment-with-details.model';
import { DataParserService } from './../services/data-parser.service';
import { EmotionalStateHistoryItem } from './../model/emotional-state-history-item.model';

import * as moment from 'moment';

const dateFormat = 'YYYY-MM-DD';

@Component({
  selector: 'statistics',
  styleUrls: ['./statistics.component.scss'],
  templateUrl: './statistics.component.html'
})
export class StatisticsComponent {
  public fromDate: moment.Moment;
  public toDate: moment.Moment;
  public isLoadingStatistics: boolean = false;

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
              private dataParserService: DataParserService) {
                this.fromDate = moment().startOf('isoWeek');
                this.toDate = moment().startOf('day');
                this.tryRefreshChart();
              }

    public tryRefreshChart() {
      // Ensure dates are valid
      if (this.toDate.isBefore(this.fromDate)) {
        this.snackBar.open('Das Start-Datum muss kleiner als das Bis-Datum sein', 'Ok');
      } else {
        this.isLoadingStatistics = true;
        this.emotionalStateServer
          .groupedEmotionalStatesWithinRange(
            this.fromDate, this.toDate.endOf('day'))
          .subscribe(
            (data) => this.handleDataLoaded(data),
            (err) => undefined,
            () => this.isLoadingStatistics = false);
      }
    }

    public getCode(emoji: string): string {
      return twemoji.convert.toCodePoint(emoji);
    }

    private handleDataLoaded(data: EmotionalStateHistoryItem[]) {
      this.comments = this.dataParserService.getCommentsWithDetails(data);

      this.chartData = [];

      // Iterate through all dates between the start and end date
      for (const m = moment(this.fromDate); m.isSameOrBefore(this.toDate); m.add(1, 'days')) {
        this.chartData.push({
          name: m.format(dateFormat),
          series: []
        });
      }

      for (const emojisPerDate of data) {
        const formattedName = moment(emojisPerDate.date).format(dateFormat);
        const chartItem = this.chartData.find((c) => c.name === formattedName);
        chartItem.series = emojisPerDate.emotionalStates.map((e) => (
          {
            name: String.fromCodePoint(parseInt(e.smileyCode, 16)),
            value: e.count
          }));
      }
    }
}
