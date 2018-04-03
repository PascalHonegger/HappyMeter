import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FaceAnalysis, HairColor, Glasses, Gender, EmotionKey, FacialHair } from '../model/face-analysis.model';

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

    // Limits some data
    // E.g. don't show you're 1% bald
    public readonly baldnessLimit = 0.5;
    public readonly beardLimit = 0.3;

    // Summarized data
    public age: number;
    public gender: Gender;

    public glasses: Glasses;
    public baldness: number;
    public hairColors: HairColor[];
    public facialHair: FacialHair;

    public smile: number;
    public emotions: EmotionKey[];

    // Translated fields
    public get genderTranslated() {
        return this.gender === 'male' ? 'Männlich' : 'Weiblich';
    }

    public get glassesTranslated() {
        switch (this.glasses) {
            case 'NoGlasses':
                return 'Keine Brille';
            case 'ReadingGlasses':
                return 'Lesebrille';
            case 'Sunglasses':
                return 'Sonnenbrille';
            case 'SwimmingGoggles':
                return'Schwimmbrille';
            default:
                return this.glasses;
        }
    }

    public get hairColorsTranslated() {
        if (this.hairColors.length === 0) {
            return 'Keine';
        }

        let translatedColors = this.hairColors.map((color) => {
            switch (color) {
                case 'brown':
                    return 'Braun';
                case 'blond':
                    return 'Blond';
                case 'black':
                    return 'Schwarz';
                case 'red':
                    return 'Rot';
                case 'other':
                    return 'Anderes';
                default:
                    return color;
            }
        });

        if (translatedColors.length !== 1) {
            // Filter color 'other' if it's not the only result
            translatedColors = translatedColors.filter((color, index) => color !== 'Anderes' || index > 0);
        }

        return translatedColors.join('-');
    }

    public get emotionsTranslated() {
        if (this.emotions.length === 0) {
            return 'Undefinierbar';
        }

        return this.emotions.map((emotion) => {
            switch (emotion) {
                case 'neutral':
                    return 'Neutral';
                case 'anger':
                    return 'Wütend';
                case 'contempt':
                    return 'Verachtend';
                case 'disgust':
                    return 'Angeekelt';
                case 'fear':
                    return 'Verängstigt';
                case 'happiness':
                    return 'Glücklich';
                case 'sadness':
                    return 'Traurig';
                case 'surprise':
                    return 'Überrascht';
                default:
                    return emotion;
            }
        })
        .join(' & ');
    }

    public ngOnInit() {
        this.drawImage();
        this.analyzeFace();
    }

    private drawImage() {
        const canvas = (this.canvasRef.nativeElement as HTMLCanvasElement);
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);

        const rect = this.face.faceRectangle;

        // Height considering image aspect ration
        const adjustedHeight = (rect.height / rect.width) * canvas.width;

        canvas.height = adjustedHeight;

        context.drawImage(this.fullImage,
            rect.left, rect.top, rect.width, rect.height,
            0, 0, canvas.width, canvas.height);
    }

    private analyzeFace() {
        const attributes = this.face.faceAttributes;
        this.age = attributes.age;
        this.gender = attributes.gender;

        this.glasses = attributes.glasses;
        this.baldness = attributes.hair.bald;
        this.hairColors = attributes.hair.hairColor
            .filter((h) => h.confidence >= 0.75) // TODO limit hair color?
            .sort((a, b) => b.confidence - a.confidence)
            .map((guess) => guess.color);

        this.smile = attributes.smile;
        this.emotions = Object.keys(attributes.emotion)
            .map((key) => ({ emotion: key as EmotionKey, confidence: attributes.emotion[key] as number }))
            .filter((h) => h.confidence >= 0.3) // TODO limit emotion?
            .sort((a, b) => b.confidence - a.confidence)
            .map((guess) => guess.emotion);

        this.facialHair = attributes.facialHair;
    }
}
