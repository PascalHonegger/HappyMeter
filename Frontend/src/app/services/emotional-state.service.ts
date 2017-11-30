import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { ServerService } from './server.service';
import { DateService } from './date.service';
import { EmotionalStateHistoryItem } from './../model/emotional-state-history-item.model';

@Injectable()
export class EmotionalStateService extends ServerService {
    constructor(private httpClient: HttpClient, private dateService: DateService) {
        super('EmotionalState');
    }

    public groupedEmotionalStatesWithinRange(from: Date, to: Date) {
        const params = new HttpParams()
            .set('from', from.toJSON())
            .set('to', to.toJSON())
            .set('utcOffsetInMinutes', (from.getTimezoneOffset()).toString());
        return this.httpClient.get<EmotionalStateHistoryItem[]>(
                this.baseUrl + '/GroupedEmotionalStatesWithinRange', { params });
    }

    public addEmotionalState(emotionId: number, comment: string) {
        const data = comment.length !== 0 ? { emotionId, comment } : { emotionId };
        return this.httpClient
            .post<void>(this.baseUrl + '/AddEmotionalState', data);
    }
}
