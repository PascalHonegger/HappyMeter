import { Component } from '@angular/core';

import { ServerService } from './../services/server.service';
import { CalculationService } from './../services/calculation.service';
import { CustomTitleService } from './../services/custom-title.service';

@Component({
  selector: 'hello',
  styleUrls: ['./hello.component.css'],
  templateUrl: './hello.component.html'
})
export class HelloComponent {
  public loadedData: string[];
  public token: string = '';

  constructor(private server: ServerService) {
  }

  /*public loadBasicData() {
    this.httpClient.get<string[]>(baseUrl + '/Data/Basic')
      .subscribe((d) => this.loadedData = d);
  }

  public loadSecureData() {
    this.httpClient.get<string[]>(baseUrl + '/Data/Secure', {
      headers: new HttpHeaders().append('token', this.token)
    })
      .subscribe((d) => this.loadedData = d);
  }*/

  public sendLogin() {
    this.server.login('admin', 'admin').subscribe((t) => this.token = t.id);
  }

  public sendLogout() {
    this.server.logout().subscribe();
  }
}
