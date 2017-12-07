import { Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';

import { EmotionalStateService } from './../services/emotional-state.service';
import { EmotionService } from './../services/emotion.service';
import { Emotion } from './../model/emotion.model';
import { CommentWithDetails } from './../model/comment-with-details.model';
import { RegularExpressions } from './../constants/regular-expressions';
import { DataParserService } from './../services/data-parser.service';
import { GroupedEmotionalState } from './../model/grouped-emotional-state.model';

import * as moment from 'moment';

// 5 Minutes
const reloadIntervalInMs = 300000;

// 20 Seconds
const sendBlockedDuration = 20000;

@Component({
  selector: 'home',
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnDestroy {
  public activeEmotions: Emotion[];
  public dailyEmotionalStates: GroupedEmotionalState[];
  public amountOfEmotions: number;

  public selectedEmotionId: number | null = null;
  public comment: string = '';
  public commentFormControl: FormControl = new FormControl('');

  public saveBlocked: boolean = false;

  public get pattern() {
    return RegularExpressions.noFunkyCharactersRegex;
  }

  public get canNotSendEmotion() {
    return this.commentFormControl.invalid || this.selectedEmotionId == null || this.saveBlocked;
  }

  public comments: CommentWithDetails[];

  private loadDataTimerId: number;

  constructor(private emotionServer: EmotionService,
              private emotionalStateServer: EmotionalStateService,
              private snackBar: MatSnackBar,
              private dataParseService: DataParserService) {
    this.loadData();
    this.loadDataTimerId = window.setInterval(() => this.loadData(), reloadIntervalInMs);
  }

  public ngOnDestroy() {
    clearInterval(this.loadDataTimerId);
  }

  public relativeSize(emotionAmount: number): number {
    return 100 / this.amountOfEmotions * emotionAmount;
  }

  public sendEmotion() {
    if (this.canNotSendEmotion) {
      return;
    }

    this.emotionalStateServer.addEmotionalState(this.selectedEmotionId, this.comment)
      .subscribe(() => {
        // Load new data
        this.loadData();
      }, (error: HttpErrorResponse) => {
        // In case the sent emoji has been disabled in the meantime
        if (error.status === 400) {
          this.loadData();
          this.snackBar.open('Bitte versuchen Sie es erneut', 'Ok');
        }
      });

    // Reset user input
    this.comment = '';
    this.selectedEmotionId = undefined;

    // Inform user
    const snackRef = this.snackBar.open(
        'Gesendet - Bitte warten Sie, bis Sie weitere Gefühlslagen erfassen können');
    this.saveBlocked = true;
    setTimeout(() => {
        this.saveBlocked = false;
        snackRef.dismiss();
      }, sendBlockedDuration);
  }

  private loadData() {
    // Active emotions for the buttons
    this.emotionServer.activeEmotions().subscribe((e) => this.activeEmotions = e);

    // Emotional state with comments for show
    const today = moment().startOf('day');
    const tomorrow = moment().endOf('day');
    this.emotionalStateServer.groupedEmotionalStatesWithinRange(today, tomorrow)
      .subscribe((data) => {
        this.comments = this.dataParseService.getCommentsWithDetails(data);
        if (data.length === 1) {
          this.dailyEmotionalStates = data[0].emotionalStates;
        } else if (data.length === 0) {
          this.dailyEmotionalStates = [];
        } else {
          console.warn('Received data from more than one date, this should never happen!',
            today, tomorrow);
          this.dailyEmotionalStates = [];
        }
        this.amountOfEmotions = this.dailyEmotionalStates
          .map((d) => d.count)
          .reduce((a, b) => a + b, 0);
      });
  }
}
