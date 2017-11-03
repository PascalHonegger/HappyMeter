import { Component } from '@angular/core';

import { EmotionalStateService } from './../services/emotional-state.service';
import { EmotionService } from './../services/emotion.service';
import { CalculationService } from './../services/calculation.service';
import { CustomTitleService } from './../services/custom-title.service';
import { EmotionalState } from './../model/emotional-state.model';

// 1 Minute
const reloadIntervalInMs = 60000;

@Component({
  selector: 'hello',
  styleUrls: ['./hello.component.css'],
  templateUrl: './hello.component.html'
})
export class HelloComponent {
  public loadedData: EmotionalState[];

  constructor(private emotionServer: EmotionService,
              private emotionalStateServer: EmotionalStateService) {
    this.loadData();
    setInterval(() => this.loadData(), reloadIntervalInMs);
  }

  private loadData() {
    this.emotionServer.dailyEmotionalStates().subscribe((e) => this.loadedData = e);
    this.emotionalStateServer.dailyEmotionalStates().subscribe((e) => this.loadedData = e);
  }
}
