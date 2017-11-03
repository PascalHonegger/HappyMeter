import { Injectable } from '@angular/core';

const usernameStorageKey = 'sessionUsername';
const passwordStorageKey = 'sessionPassword';

@Injectable()
export class AuthService {
    private _username: string;
    private _password: string;

    constructor() {
        this._username = sessionStorage.getItem(usernameStorageKey) || '';
        this._password = sessionStorage.getItem(passwordStorageKey) || '';
    }

    public get username(): string {
        return this._username;
    }

    public set username(value: string) {
        this._username = value;
        sessionStorage.setItem(usernameStorageKey, JSON.stringify(value));
    }

    public get password(): string {
        return this._password;
    }

    public set password(value: string) {
        this._password = value;
        sessionStorage.setItem(passwordStorageKey, JSON.stringify(value));
    }

    public clearCredentials() {
        this._username = '';
        this._password = '';

        sessionStorage.removeItem(usernameStorageKey);
        sessionStorage.removeItem(passwordStorageKey);
    }
}
