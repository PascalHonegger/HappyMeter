import { Component } from '@angular/core';

import { EmotionalStateService } from './../services/emotional-state.service';
import { CalculationService } from './../services/calculation.service';
import { CustomTitleService } from './../services/custom-title.service';
import { EmotionalState } from './../model/emotional-state.model';

@Component({
  selector: 'hello',
  styleUrls: ['./hello.component.css'],
  templateUrl: './hello.component.html'
})
export class HelloComponent {
  public loadedData: EmotionalState[];

  constructor(private server: EmotionalStateService) {
  }

  public loadEmotionalStates() {
    this.server.dailyEmotionalStates().subscribe((e) => this.loadedData = e);
  }
}
