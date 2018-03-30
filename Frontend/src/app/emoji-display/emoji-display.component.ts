import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import * as twemoji from 'twemoji';

@Component({
  selector: 'emoji-display',
  styleUrls: ['./emoji-display.component.css'],
  templateUrl: './emoji-display.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmojiDisplayComponent {
  @Input()
  public emojiCodePoint: string;

  public get emojiFromCodePoint(): string {
    return twemoji.convert.fromCodePoint(this.emojiCodePoint);
  }
}
