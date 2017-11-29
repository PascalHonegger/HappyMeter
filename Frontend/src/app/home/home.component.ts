import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';

import { EmotionalStateService } from './../services/emotional-state.service';
import { EmotionService } from './../services/emotion.service';
import { EmotionalState } from './../model/emotional-state.model';
import { Emotion } from './../model/emotion.model';
import { CommentWithDetails } from './../model/comment-with-details.model';
import { RegularExpressions } from './../constants/regular-expressions';

// 1 Minute
const reloadIntervalInMs = 60000;

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

  public get activeEmotionsWithAtLeastOneEntry(): Emotion[] {
    return this.activeEmotions.filter((e) => this.amountOfEmotions(e.id) !== 0);
  }

  public get commentsWithEmotionAndTimestamp(): CommentWithDetails[] {
    return this.dailyEmotionalStates.filter((d) => d.comment).map((d) => ({
        comment: d.comment,
        postDate: d.createdDate,
        emojiCode: this.activeEmotions.find((e) => e.id === d.emotionId).smileyCode
    }));
  }

  constructor(private emotionServer: EmotionService,
              private emotionalStateServer: EmotionalStateService,
              private snackBar: MatSnackBar) {
    this.loadData();
    setInterval(() => this.loadData(), reloadIntervalInMs);
  }

  public relativeSize(emotionId: number): number {
    const totalAmount = this.dailyEmotionalStates.length;
    const emotionAmount = this.amountOfEmotions(emotionId);
    return 100 / totalAmount * emotionAmount;
  }

  public randomComment(emotionId: number): string {
    const emotion = this.dailyEmotionalStates
      .find((de) => de.emotionId === emotionId && de.comment != null);
    return emotion !== undefined ? emotion.comment : undefined;
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

  public amountOfEmotions(emotionId: number) {
    return this.dailyEmotionalStates.filter((d) => d.emotionId === emotionId).length;
  }

  // Thanks to https://stackoverflow.com/a/12646864
  private shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  private loadData() {
    this.emotionServer
      .activeEmotions().subscribe((e) => this.activeEmotions = e);
    this.emotionalStateServer
      .dailyEmotionalStates().subscribe((de) => this.dailyEmotionalStates = this.shuffleArray(de));
  }
}
