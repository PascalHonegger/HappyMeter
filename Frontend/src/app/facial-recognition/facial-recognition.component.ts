import { Component } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { FaceApiService } from '../services/face-api.service';
import { Subject } from 'rxjs';
import { FaceAnalysis } from '../model/face-analysis.model';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'facial-recognition',
    templateUrl: 'facial-recognition.component.html',
    styleUrls: ['facial-recognition.component.scss']
})
export class FacialRecognitionComponent {
    public failedToStartCamera: boolean = false;
    public faces: FaceAnalysis[];
    public errorMessage: string;

    public cameraTrigger = new Subject<void>();

    constructor(private faceService: FaceApiService, route: ActivatedRoute) {
        route.params.subscribe(
            (params) => this.analyzeImage(params['imageBase64'])
        );
    }

    private analyzeImage(imageBase64: string) {
        this.faces = null;
        this.faceService.detectFaces(imageBase64)
            .subscribe(
                (faces) => {
                    this.faces = faces;
                },
                (err: HttpErrorResponse) => {
                    this.errorMessage = err.message;
                }
        );
    }
}
