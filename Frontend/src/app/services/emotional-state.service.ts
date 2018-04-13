import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpUrlEncodingCodec } from '@angular/common/http';

import { ServerService } from './server.service';
import { EmotionalStateHistoryItem } from './../model/emotional-state-history-item.model';

import { Moment } from 'moment';
import { HttpParamsOptions } from '@angular/common/http/src/params';

@Injectable()
export class EmotionalStateService extends ServerService {
    constructor(private httpClient: HttpClient) {
        super('EmotionalState');
    }

    public groupedEmotionalStatesWithinRange(from: Moment, to: Moment) {
        const params = new HttpParams({encoder: new GhQueryEncoder()} as HttpParamsOptions)
            .set('from', from.format())
            .set('to', to.format());
        return this.httpClient.get<EmotionalStateHistoryItem[]>(
                this.baseUrl + '/GroupedEmotionalStatesWithinRange', { params });
    }

    public addEmotionalState(emotionId: number, comment: string) {
        const data = comment.length !== 0 ? { emotionId, comment } : { emotionId };
        return this.httpClient
            .post<void>(this.baseUrl + '/AddEmotionalState', data);
    }

    public addEmojiFromFaceAnalysis(emojiCode: string) {
        return this.httpClient
            .post<void>(this.baseUrl + '/AddEmojiFromFaceAnalysis', { emojiCode });
    }
}

// Replace '+' as of issue https://github.com/angular/angular/issues/11058
// Thanks to workaround: https://github.com/angular/angular/issues/11058#issuecomment-247367318
// tslint:disable-next-line:max-classes-per-file
class GhQueryEncoder extends HttpUrlEncodingCodec {
    public encodeKey(k: string): string {
        k = super.encodeKey(k);
        return k.replace(/\+/gi, '%2B');
    }
    public encodeValue(v: string): string {
        v = super.encodeKey(v);
        return v.replace(/\+/gi, '%2B');
    }
}
