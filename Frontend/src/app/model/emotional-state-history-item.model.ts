import { GroupedEmotionalState } from './grouped-emotional-state.model';

export interface EmotionalStateHistoryItem {
    date: Date;
    emotionalStates: GroupedEmotionalState[];
}
