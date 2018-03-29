import { Component } from '@angular/core';

import { Link } from './model/link.model';

@Component({
  selector: 'app',
  styleUrls: [ './app.component.scss' ],
  templateUrl: './app.component.html'
})
export class AppComponent {
  public links: Link[] = [{
    url: ['/'],
    matIcon: 'insert_emoticon',
    content: 'Start'
  },
  {
    url: ['/face'],
    matIcon: 'face',
    content: 'Kamera'
  },
  {
    url: ['/statistics'],
    matIcon: 'insert_chart',
    content: 'Statistiken'
  }];
  /*
   , {
    url: ['/questions'],
    matIcon: 'question_answer',
    content: 'Q&A'
  }
   */
}
