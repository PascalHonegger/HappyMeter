import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FaceAnalysis } from '../model/face-analysis.model';

@Component({
    selector: 'face-representation',
    templateUrl: 'face-representation.component.html',
    styleUrls: ['face-representation.component.scss']
})
export class FaceRepresentationComponent implements OnInit {
    @Input()
    public face: FaceAnalysis;

    @Input()
    public fullImage: HTMLImageElement;

    @ViewChild('faceCanvas')
    public canvasRef: ElementRef;

    public ngOnInit() {
        const canvas = (this.canvasRef.nativeElement as HTMLCanvasElement);
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);

        const rect = this.face.faceRectangle;

        canvas.width = rect.width;
        canvas.height = rect.height;

        context.drawImage(this.fullImage,
            rect.left, rect.top, rect.width, rect.height,
            0, 0, rect.width, rect.height);
    }

    public get hasGlasses(): boolean {
        return this.face.faceAttributes.accessories.findIndex((a) => a.type === 'glasses') !== -1;
    }

    public get hairColor(): string {
        return this.face.faceAttributes.hair.bald >= 0.75
            ? 'bald'
            : this.face.faceAttributes.hair.hairColor[0].color; // Correct?
    }
}
