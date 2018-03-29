import { Component, Input } from '@angular/core';
import { FaceAnalysis } from '../model/face-analysis.model';

@Component({
    selector: 'face-representation',
    templateUrl: 'face-representation.component.html',
    styleUrls: ['face-representation.component.scss']
})
export class FaceRepresentationComponent {
    @Input()
    public face: FaceAnalysis;

    public get hasGlasses(): boolean {
        return this.face.faceAttributes.accessories.findIndex((a) => a.type === 'glasses') !== -1;
    }

    public get hairColor(): string {
        return this.face.faceAttributes.hair.bald >= 0.75
            ? 'bald'
            : this.face.faceAttributes.hair.hairColor[0].color; // Correct?
    }
}
