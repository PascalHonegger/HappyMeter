import { Component, AfterViewInit } from '@angular/core';
import { FaceApiService } from '../services/face-api.service';
import { Subject } from 'rxjs';
import { FaceAnalysis } from '../model/face-analysis.model';
import { first } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
    selector: 'facial-recognition',
    templateUrl: 'facial-recognition.component.html',
    styleUrls: ['facial-recognition.component.scss']
})
export class FacialRecognitionComponent implements AfterViewInit {
    public failedToStartCamera: boolean = false;
    public faces: FaceAnalysis[];
    public errorMessage: string;
    public imageDataUrl: SafeUrl;

    public imageLoaded = new Subject<void>();

    constructor(private faceService: FaceApiService,
                private sanitizer: DomSanitizer,
                private route: ActivatedRoute) {
    }

    public ngAfterViewInit() {
        this.route.params.subscribe(
            (params) => setTimeout(() => this.analyzeImage(params['imageBase64']))
        );
    }

    private async analyzeImage(imageBase64: string) {
        const imageDataUrl = `data:image/JPEG;base64,${imageBase64}`;
        this.imageDataUrl = this.sanitizer.bypassSecurityTrustUrl(imageDataUrl);

        // Ensure the image was loaded
        await this.imageLoaded.pipe(first()).toPromise();

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
