// General information about numbers:
// Numbers usually range form 0 to 1
// Higher number mean more (e.g. more confidence, more baldness, more happiness)

export interface FaceAnalysis {
    faceRectangle: {
        top: number;
        left: number;
        width: number;
        height: number;
    };
    faceAttributes: FaceAttributes;
}

export interface FaceAttributes {
    age: number;
    gender: 'male' | 'female';
    smile: number;
    facialHair: {
       moustache: number;
       beard: number;
       sideburns: number;
    };
    glasses: 'NoGlasses' | 'ReadingGlasses' | 'Sunglasses' | 'SwimmingGoggles';
    emotion: {
        neutral: number;
        anger: number;
        contempt: number;
        disgust: number;
        fear: number;
        happiness: number;
        sadness: number;
        surprise: number;
    };
    hair: {
        bald: number;
        invisible: boolean; // E.g. off screen
        hairColor?: Array<{ color: HairColor, confidence: number }>;
    };
    accessories: Array<{ type: Accessoire, confidence: number }>;
}

export type HairColor = 'brown' | 'black' | 'blond' | 'red' | 'other';
export type Accessoire = 'headwear' | 'glasses' | 'mask';
