import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji/emoji.component';

@Component({
  styleUrls: ['./select-emoji-dialog.component.css'],
  templateUrl: './select-emoji-dialog.component.html'
})
export class SelectEmojiDialogComponent {
  public selectedEmojiCodePoint: string = '';

  public i18n = {
    search: 'Suchen',
    notfound: 'Emoji nicht gefunden',
    categories: {
      search: 'Suchresultate',
      recent: 'Oft verwendet',
      people: 'Smileys & Personen',
      nature: 'Tiere & Natur',
      foods: 'Essen & Trinken',
      activity: 'Freizeit',
      places: 'Reisen & Orte',
      objects: 'Objekte',
      symbols: 'Symbole',
      flags: 'Flaggen',
      custom: 'Benutzerdefiniert',
    }
  };

  constructor(public dialogRef: MatDialogRef<SelectEmojiDialogComponent>) { }

  public setSelectedEmoji(value: EmojiEvent) {
    this.selectedEmojiCodePoint = twemoji.convert.toCodePoint(value.emoji.native);
  }

  public save() {
    this.dialogRef.close(this.selectedEmojiCodePoint);
  }

  public close() {
    this.dialogRef.close();
  }
}
