import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { FaceAnalysis } from '../model/face-analysis.model';
import { FaceApiService } from '../services/face-api.service';

@Component({
    selector: 'facial-recognition',
    templateUrl: 'facial-recognition.component.html',
    styleUrls: ['facial-recognition.component.scss']
})
export class FacialRecognitionComponent {
    public failedToStartCamera: boolean = false;
    public faces: FaceAnalysis[];
    public errorMessage: string;
    public fullImage: HTMLImageElement;

    public imageLoaded = new Subject<void>();

    private existingFaceSubscription: Subscription;

    @Input()
    public set imageData(imageBase64: string) {
        if (this._imageData === imageBase64) {
            return;
        }
        this.analyzeImage(imageBase64);
    }

    public get imageData(): string {
        return this._imageData;
    }

    private _imageData: string;

    constructor(private faceService: FaceApiService,
                private sanitizer: DomSanitizer) {
        this.fullImage = new Image();
        this.fullImage.onload = () => this.imageLoaded.next();
    }

    private async analyzeImage(imageBase64: string) {
        if (this.existingFaceSubscription) {
            this.existingFaceSubscription.unsubscribe();
        }

        const imageDataUrl = `data:image/JPEG;base64,${imageBase64}`;

        this.fullImage.src = imageDataUrl;

        // Ensure the image was loaded
        await this.imageLoaded
            .pipe(first())
            .toPromise();

        this.faces = null;
        this.existingFaceSubscription = this.faceService.detectFaces(imageBase64)
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
