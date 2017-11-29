import { isDevMode } from '@angular/core';

const baseUrlDebug: string = 'http://localhost:49484/api/';

// Used for production release
// const baseUrlProd: string = 'http://atoshappymeter.azurewebsites.net/api/';
const baseUrlProd: string = 'http://ahmlatest.azurewebsites.net/api/';

export abstract class ServerService {
    protected readonly baseUrl: string;

    constructor(controllerPrefix: string) {
        this.baseUrl = (isDevMode() ? baseUrlDebug : baseUrlProd) + controllerPrefix;
    }
}
