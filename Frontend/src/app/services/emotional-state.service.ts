import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { ServerService } from './server.service';
import { EmotionalState } from './../model/emotional-state.model';
import { GroupedEmotionalState } from './../model/grouped-emotional-state.model';

@Injectable()
export class EmotionalStateService extends ServerService {
    constructor(private httpClient: HttpClient) {
        super('EmotionalState');
    }

    public dailyEmotionalStates() {
        return this.httpClient.get<EmotionalState[]>(this.baseUrl + '/DailyEmotionalStates');
    }

    public groupedEmotionalStatesWithinRange(from: Date, to: Date) {
        const params = new HttpParams()
            .set('from', from.toISOString())
            .set('to', to.toISOString());
        return this.httpClient.get<GroupedEmotionalState[]>(
                this.baseUrl + '/GroupedEmotionalStatesWithinRange', { params });
    }

    public addEmotionalState(emotionId: number, comment: string) {
        const data = comment.length !== 0 ? { emotionId, comment } : { emotionId };
        return this.httpClient
            .post<void>(this.baseUrl + '/AddEmotionalState', data);
    }
}
