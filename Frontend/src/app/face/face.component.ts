import { Component } from '@angular/core';
import { WebCamComponent } from 'ack-angular-webcam';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
    selector: 'face',
    templateUrl: 'face.component.html',
    styleUrls: ['face.component.scss']
})
export class FaceComponent {
    public failedToStartCamera: boolean = false;
    public webcam: WebCamComponent; // Populated by template

    public latestImage: string;

    constructor(private router: Router, private snackBar: MatSnackBar) { }

    public async captureImage() {
        try {
            const base64Image = await this.webcam.getBase64('image/JPEG');
            // Cut off 'data:image/JPEG;base64,'
            const onlyBase64 = base64Image.substring(23);
            this.latestImage = onlyBase64;
        } catch (error) {
            console.error(error);
            this.snackBar.open('Bild konnte nicht verwendet werden', 'Ok', { duration: 5000 });
        }
    }
}
