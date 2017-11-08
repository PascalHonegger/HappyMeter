import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ServerService } from './server.service';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class UserService extends ServerService {
    constructor(private httpClient: HttpClient) {
        super('User');
    }

    public testCredentials(username: string, password: string) {
        return this.httpClient.get<void>(this.baseUrl + '/TestCredentials', {
            headers: new HttpHeaders({
                username,
                password
            })
        });
    }

    public setNewUsername(username: string) {
        return this.httpClient.post<void>(this.baseUrl + '/SetNewUsername', username);
    }

    public setNewPassword(password: string) {
        return this.httpClient.post<void>(this.baseUrl + '/SetNewPassword', password);
    }
}
