import { Component } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { FaceApiService } from '../services/face-api.service';
import { Subject } from 'rxjs';

@Component({
    selector: 'face',
    templateUrl: 'face.component.html',
    styleUrls: ['face.component.scss']
})
export class FaceComponent {
    public failedToLoad: boolean = false;
    public faceData: any;

    public cameraTrigger = new Subject<void>();

    constructor(private faceService: FaceApiService) { }

    public capturedImage(image: WebcamImage) {
        this.faceService.detectFaces(image.imageAsBase64).subscribe(
            (faces) => {
                console.log(faces);
                this.faceData = faces;
            }
        );
    }
}
