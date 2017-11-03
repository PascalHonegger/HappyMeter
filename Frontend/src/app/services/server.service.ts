import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Token } from './../model/token.model';
import { AuthService } from './auth.service';

const baseUrlDebug: string = 'http://localhost:62351/api';

// TODO Prod port 80?
const baseUrlProd: string = 'http://localhost:62351/api';

@Injectable()
export class ServerService {
    private readonly baseUrl: string;

    constructor(private httpClient: HttpClient, private authService: AuthService) {
        this.baseUrl = isDevMode() ? baseUrlDebug : baseUrlProd;
    }

    public login(username: string, password: string) {
        return this.httpClient.post<Token>(this.baseUrl + '/Auth/Login', { username, password });
    }

    public logout() {
        return this.httpClient.post<void>(this.baseUrl + '/Auth/Logout', null);
    }
}
