import { Component } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { FaceApiService } from '../services/face-api.service';
import { Subject } from 'rxjs';
import { FaceAnalysis } from '../model/face-analysis.model';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
    selector: 'face',
    templateUrl: 'face.component.html',
    styleUrls: ['face.component.scss']
})
export class FaceComponent {
    public failedToStartCamera: boolean = false;
    public faces: FaceAnalysis[];

    public cameraTrigger = new Subject<void>();

    constructor(private router: Router) { }

    public capturedImage(image: WebcamImage) {
        this.router.navigate(['/facial-recognition', image.imageAsBase64]);
    }
}
