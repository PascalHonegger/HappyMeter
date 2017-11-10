import { isDevMode } from '@angular/core';

const baseUrlDebug: string = 'http://localhost:49484/api/';

// TODO Prod port 80?
const baseUrlProd: string = 'http://localhost:49484/api/';

export abstract class ServerService {
    protected readonly baseUrl: string;

    constructor(controllerPrefix: string) {
        this.baseUrl = (isDevMode() ? baseUrlDebug : baseUrlProd) + controllerPrefix;
    }
}
