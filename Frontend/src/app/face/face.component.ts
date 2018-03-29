import { Component } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { FaceApiService } from '../services/face-api.service';
import { Subject } from 'rxjs';
import { FaceAnalysis } from '../model/face-analysis.model';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'face',
    templateUrl: 'face.component.html',
    styleUrls: ['face.component.scss']
})
export class FaceComponent {
    public failedToStartCamera: boolean = false;
    public loadingFaces: boolean = false;
    public faces: FaceAnalysis[];

    public cameraTrigger = new Subject<void>();

    constructor(private faceService: FaceApiService) { }

    public capturedImage(image: WebcamImage) {
        this.loadingFaces = true;
        this.faceService.detectFaces(image.imageAsBase64)
            .pipe(finalize(() => this.loadingFaces = false))
            .subscribe(
                (faces) => {
                    console.log(faces);
                    this.faces = faces;
                }
        );
    }
}
