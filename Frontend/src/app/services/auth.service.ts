import { Token } from './../model/token.model';
import { Injectable } from '@angular/core';

const tokenStorageKey = 'sessionToken';

@Injectable()
export class AuthService {
    private _token: string;

    constructor() {
        this._token = sessionStorage.getItem(tokenStorageKey) || '';
    }

    public get token(): string {
        return this._token;
    }

    public set token(value: string) {
        this._token = value;
        sessionStorage.setItem(tokenStorageKey, JSON.stringify(value));
    }

    public clearToken(): void {
        this._token = null;
        sessionStorage.removeItem(tokenStorageKey);
    }
}
