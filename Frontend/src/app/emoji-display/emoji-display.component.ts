import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import { EmotionalStateService } from './../services/emotional-state.service';
import { EmotionService } from './../services/emotion.service';
import { CalculationService } from './../services/calculation.service';
import { CustomTitleService } from './../services/custom-title.service';
import { EmotionalState } from './../model/emotional-state.model';
import { Emotion } from './../model/emotion.model';

// 1 Minute
const reloadIntervalInMs = 60000;

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
