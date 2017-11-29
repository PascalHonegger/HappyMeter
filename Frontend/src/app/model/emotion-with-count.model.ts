import { Emotion } from './emotion.model';

export interface EmotionWithCount extends Emotion {
    amount: number;
}
