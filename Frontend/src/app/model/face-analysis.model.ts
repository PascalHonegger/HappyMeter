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
    gender: Gender;
    smile: number;
    facialHair: FacialHair;
    glasses: Glasses;
    emotion: Emotion;
    hair: Hair;
    accessories: Array<{ type: Accessoire, confidence: number }>;
}

export interface Emotion {
    neutral: number;
    anger: number;
    contempt: number;
    disgust: number;
    fear: number;
    happiness: number;
    sadness: number;
    surprise: number;
}

export interface FacialHair {
    moustache: number;
    beard: number;
    sideburns: number;
}

export interface Hair {
    bald: number;
    invisible: boolean; // E.g. off screen
    hairColor?: Array<{ color: HairColor, confidence: number }>;
}

export type HairColor = 'brown' | 'black' | 'blond' | 'red' | 'other';
export type Accessoire = 'headwear' | 'glasses' | 'mask';
export type Glasses = 'NoGlasses' | 'ReadingGlasses' | 'Sunglasses' | 'SwimmingGoggles';
export type Gender = 'male' | 'female';
export type EmotionKey = keyof Emotion;
