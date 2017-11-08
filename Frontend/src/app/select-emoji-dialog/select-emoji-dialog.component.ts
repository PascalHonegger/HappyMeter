import { Component } from '@angular/core';

import { EmotionalStateService } from './../services/emotional-state.service';
import { EmotionService } from './../services/emotion.service';
import { CalculationService } from './../services/calculation.service';
import { CustomTitleService } from './../services/custom-title.service';
import { EmotionalState } from './../model/emotional-state.model';
import { Emotion } from './../model/emotion.model';
import { FormControl } from '@angular/forms';
import { MatSnackBar, MatDialogRef } from '@angular/material';
import { UserService } from './../services/user.service';
import { AuthService } from './../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  styleUrls: ['./select-emoji-dialog.component.css'],
  templateUrl: './select-emoji-dialog.component.html'
})
export class SelectEmojiDialogComponent {
  public selectedEmojiCodePoint: string = '';

  constructor(public dialogRef: MatDialogRef<SelectEmojiDialogComponent>) { }

  public setSelectedEmoji(value: string) {
    this.selectedEmojiCodePoint = value.codePointAt(0).toString(16);
  }

  public save() {
    this.dialogRef.close(this.selectedEmojiCodePoint);
  }

  public close() {
    this.dialogRef.close();
  }
}
