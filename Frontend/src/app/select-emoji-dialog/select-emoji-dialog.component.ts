import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

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
