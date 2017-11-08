import { Injectable, isDevMode } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { ServerService } from './server.service';
import { Emotion } from './../model/emotion.model';
import { FullEmotion } from './../model/full-emotion.model';

@Injectable()
export class EmotionService extends ServerService {
    constructor(private httpClient: HttpClient) {
        super('Emotion');
    }

    public activeEmotions() {
        return this.httpClient.get<Emotion[]>(this.baseUrl + '/ActiveEmotions');
    }

    public allEmotions() {
        return this.httpClient.get<FullEmotion[]>(this.baseUrl + '/AllEmotions');
    }

    public setActiveForEmotion(emotionId: number, isActive: boolean) {
        return this.httpClient
            .post<void>(this.baseUrl + '/SetActiveForEmotion', { emotionId, isActive });
    }

    public setSmileyForEmotion(emotionId: number, newSmileyCode: string) {
        return this.httpClient
            .post<void>(this.baseUrl + '/SetSmileyForEmotion', { emotionId, newSmileyCode });
    }

    public addNewEmotion(newSmileyCode: string) {
        return this.httpClient
            .post<void>(this.baseUrl + '/AddNewEmotion', { newSmileyCode });
    }
}
