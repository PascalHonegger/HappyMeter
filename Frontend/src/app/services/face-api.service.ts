import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { FaceAnalysis } from '../model/face-analysis.model';

const baseUrl = 'https://westeurope.api.cognitive.microsoft.com/face/v1.0';

@Injectable()
export class FaceApiService {
    private headers = new HttpHeaders({
        'Content-Type': 'application/octet-stream',
        'Ocp-Apim-Subscription-Key': 'bc4ace4b4dda407f8a28011a0fe57879',
    });

    constructor(private httpClient: HttpClient) {
    }

    public detectFaces(data: string) {
        const arrayBuffer = this.base64ToArrayBuffer(data);

        return this.httpClient.post<FaceAnalysis[]>(baseUrl + '/detect', arrayBuffer, {
            params: new HttpParams({fromObject: {
                returnFaceId: 'false',
                returnFaceLandmarks: 'false',
                returnFaceAttributes: [
                    'age',
                    'gender',
                    // 'headPose',
                    // 'smile',
                    'facialHair',
                    'glasses',
                    'emotion',
                    'hair',
                    // 'makeup',
                    // 'occlusion',
                    // 'accessories',
                    // 'blur',
                    // 'exposure',
                    // 'noise'
                ].join(',')
            }}),
            headers: this.headers
        });
    }

    // See https://stackoverflow.com/a/21797381
    private base64ToArrayBuffer(base64) {
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }
}
