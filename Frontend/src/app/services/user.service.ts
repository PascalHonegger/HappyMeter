import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ServerService } from './server.service';

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

    public setNewUsername(newUsername: string) {
        return this.httpClient.post<void>(this.baseUrl + '/SetNewUsername', { newUsername });
    }

    public setNewPassword(newPassword: string) {
        return this.httpClient.post<void>(this.baseUrl + '/SetNewPassword', { newPassword });
    }
}
