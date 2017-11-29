import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';

import { EmotionalStateService } from './../services/emotional-state.service';
import { EmotionService } from './../services/emotion.service';
import { EmotionalState } from './../model/emotional-state.model';
import { Emotion } from './../model/emotion.model';
import { EmotionWithCount } from './../model/emotion-with-count.model';
import { CommentWithDetails } from './../model/comment-with-details.model';
import { RegularExpressions } from './../constants/regular-expressions';

// 5 Minutes
const reloadIntervalInMs = 300000;

// 20 Seconds
const sendBlockedDuration = 20000;

@Component({
  selector: 'home',
  styleUrls: ['./home.component.css'],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  public activeEmotions: Emotion[];
  public dailyEmotionalStates: EmotionalState[];

  public selectedEmotionId: number | null = null;
  public comment: string = '';
  public commentFormControl: FormControl = new FormControl('');

  public saveBlocked: boolean = false;

  public get pattern() {
    return RegularExpressions.noFunkyCharactersRegex;
  }

  public activeEmotionsWithAtLeastOneEntry: EmotionWithCount[];

  public commentsWithEmotionAndTimestamp: CommentWithDetails[];

  constructor(private emotionServer: EmotionService,
              private emotionalStateServer: EmotionalStateService,
              private snackBar: MatSnackBar) {
    this.loadData();
    setInterval(() => this.loadData(), reloadIntervalInMs);
  }

  public relativeSize(emotionAmount: number): number {
    return 100 / this.dailyEmotionalStates.length * emotionAmount;
  }

  public sendEmotion() {
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

  private amountOfEmotions(emotionId: number) {
    return this.dailyEmotionalStates.filter((d) => d.emotionId === emotionId).length;
  }

  private loadData() {
    const loadingEmotionsSubscription = this.emotionServer
      .activeEmotions().subscribe((e) => {
        this.activeEmotions = e;
        if (loadingEmotionalStatesSubscription.closed) {
          this.transformServerData();
        }
      });
    const loadingEmotionalStatesSubscription = this.emotionalStateServer
      .dailyEmotionalStates().subscribe((de) => {
        this.dailyEmotionalStates = de.reverse();
        if (loadingEmotionsSubscription.closed) {
          this.transformServerData();
        }
      });
  }

  private transformServerData() {
    this.activeEmotionsWithAtLeastOneEntry =
      this.activeEmotions
        .map((e) => {
          const withCount = e as EmotionWithCount;
          withCount.amount = this.amountOfEmotions(e.id);
          return withCount;
        })
        .filter((e) => e.amount !== 0);

    this.commentsWithEmotionAndTimestamp =
      this.dailyEmotionalStates.filter((d) => d.comment).map((d) => ({
        emotionalStateId: d.id,
        comment: d.comment,
        postDate: d.createdDate,
        emojiCode: this.activeEmotions.find((e) => e.id === d.emotionId).smileyCode
      }));
  }
}
