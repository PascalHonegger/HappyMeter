export interface GroupedEmotionalState {
    smileyCode: string;
    count: number;
    comments: Array<{ comment: string, postDate: Date, id: number}>;
}
