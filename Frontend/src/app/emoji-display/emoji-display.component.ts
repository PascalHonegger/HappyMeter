import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

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
    return String.fromCodePoint(parseInt(this.emojiCodePoint, 16));
  }
}
