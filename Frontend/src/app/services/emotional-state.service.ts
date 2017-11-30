import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { ServerService } from './server.service';
import { EmotionalState } from './../model/emotional-state.model';
import { DateService } from './date.service';
import { EmotionalStateHistoryItem } from './../model/emotional-state-history-item.model';

@Injectable()
export class EmotionalStateService extends ServerService {
    constructor(private httpClient: HttpClient, private dateService: DateService) {
        super('EmotionalState');
    }

    public dailyEmotionalStates() {
        return this.httpClient.get<EmotionalState[]>(this.baseUrl + '/DailyEmotionalStates');
    }

    public groupedEmotionalStatesWithinRange(from: Date, to: Date) {
        // Use substring as the time-offset is not used
        const params = new HttpParams()
            .set('from', this.dateService.formatDate(from))
            .set('to', this.dateService.formatDate(to));
        return this.httpClient.get<EmotionalStateHistoryItem[]>(
                this.baseUrl + '/GroupedEmotionalStatesWithinRange', { params });
    }

    public addEmotionalState(emotionId: number, comment: string) {
        const data = comment.length !== 0 ? { emotionId, comment } : { emotionId };
        return this.httpClient
            .post<void>(this.baseUrl + '/AddEmotionalState', data);
    }
}
