import { Injectable } from '@angular/core';
import { Gender, Glasses, HairColor, EmotionKey } from '../model/face-analysis.model';

@Injectable()
export class EmojiService {
    // A special unicode character used to concat emojis
    private zeroWidthJoiner = '\u200D';

    /**
     * The fitting emoji code points
     * @param face The face to search the emoji for
     */
    public findEmojis(
        age: number,
        gender: Gender,
        glasses: Glasses,
        isBald: boolean,
        hairColor: HairColor,
        hasBeard: boolean,
        hasMoustache: boolean,
        hasSideburns: boolean,
        emotion: EmotionKey): string[] {

        const personEmoji = (hasBeard || hasMoustache || hasSideburns)
            ? '🧔'
            : this.findEmojiPerson(age, gender);

        const glassesEmoji = this.findEmojiGlasses(glasses);

        const emotionEmoji = this.findEmojiEmotion(emotion);

        let allEmojisString = '';

        [personEmoji, glassesEmoji, emotionEmoji].forEach((emoji) => {
            if (emoji === '') {
                return;
            }

            if (allEmojisString.length === 0) {
                allEmojisString = emoji;
            } else {
                allEmojisString += '➕' + emoji;
            }
        });

        const codePoints: string[] = [];

        twemoji.parse(allEmojisString, (iconId) => {
            codePoints.push(iconId);
            return iconId;
        });

        return codePoints;
    }

    private findEmojiPerson(age: number, gender: Gender): string {
        if (age <= 2) {
            return '👶';
        }

        if (age <= 14) {
            return gender === 'male' ? '👦' : '👧';
        }

        if (age <= 55) {
            return gender === 'male' ? '👨' : '👩';
        }

        return gender === 'male' ? '👴' : '👵';
    }

    private findEmojiGlasses(glasses: Glasses): string {
        switch (glasses) {
            case 'ReadingGlasses':
                return '👓';
            case 'Sunglasses':
                return '🕶️';
            case 'SwimmingGoggles':
                return '🥽';
            default:
                return '';
        }
    }

    private findEmojiEmotion(emotion: EmotionKey): string {
        switch (emotion) {
            case 'neutral':
                return '😐';
            case 'anger':
                return '😠';
            case 'contempt':
                return '🙄';
            case 'disgust':
                return '🤢';
            case 'fear':
                return '😨';
            case 'happiness':
                return '😀';
            case 'sadness':
                return '😭';
            case 'surprise':
                return '😯';
            default:
                return '';
        }
    }
}
