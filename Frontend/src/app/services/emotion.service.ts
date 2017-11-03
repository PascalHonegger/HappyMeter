import { Injectable, isDevMode } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { ServerService } from './server.service';
import { EmotionalState } from './../model/emotional-state.model';

@Injectable()
export class EmotionService extends ServerService {
    constructor(private httpClient: HttpClient) {
        super('EmotionalState');
    }

    public dailyEmotionalStates() {
        return this.httpClient.get<EmotionalState[]>(this.baseUrl + '/DailyEmotionalStates');
    }

    public allEmotionalStatesWithinRange(from: Date, to: Date) {
        const params = new HttpParams()
            .set('from', from.toISOString())
            .set('to', to.toISOString());
        return this.httpClient
            .get<EmotionalState[]>(this.baseUrl + '/AllEmotionalStatesWithinRange', { params });
    }

    public addEmotionalState(emotionId: number, comment: string) {
        return this.httpClient
            .post<void>(this.baseUrl + 'User/SetNewUsername', { emotionId, comment });
    }
}
