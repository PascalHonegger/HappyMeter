import { Component } from '@angular/core';

import { EmotionalStateService } from './../services/emotional-state.service';
import { EmotionService } from './../services/emotion.service';
import { CalculationService } from './../services/calculation.service';
import { CustomTitleService } from './../services/custom-title.service';
import { EmotionalState } from './../model/emotional-state.model';
import { Emotion } from './../model/emotion.model';

// 1 Minute
const reloadIntervalInMs = 60000;

@Component({
  selector: 'hello',
  styleUrls: ['./hello.component.css'],
  templateUrl: './hello.component.html'
})
export class HelloComponent {
  public activeEmotions: Emotion[];
  public dailyEmotionalStates: EmotionalState[];

  constructor(private emotionServer: EmotionService,
              private emotionalStateServer: EmotionalStateService) {
    this.loadData();
    setInterval(() => this.loadData(), reloadIntervalInMs);
  }

  private loadData() {
    this.emotionServer
      .activeEmotions().subscribe((e) => this.activeEmotions = e);
    this.emotionalStateServer
      .dailyEmotionalStates().subscribe((de) => this.dailyEmotionalStates = de);
  }
}
