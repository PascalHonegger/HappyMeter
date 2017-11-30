import { Injectable } from '@angular/core';
import { CommentWithDetails } from './../model/comment-with-details.model';
import { EmotionalStateHistoryItem } from './../model/emotional-state-history-item.model';

@Injectable()
export class DataParserService {
    public getCommentsWithDetails(data: EmotionalStateHistoryItem[]): CommentWithDetails[] {
        const arrayArrayComments = data
        .map((d) =>
          d.emotionalStates
            .filter((e) => e.comments)
            .map((e) =>
              e.comments.map<CommentWithDetails>((c) => (
                {
                  emotionalStateId: c.id,
                  comment: c.comment,
                  postDate: c.postDate,
                  emojiCode: e.smileyCode
                }))));
        if (arrayArrayComments.length === 0) {
            return [];
        }
        const arrayComments = arrayArrayComments.reduce((a, b) => a.concat(b));
        if (arrayComments.length === 0) {
            return [];
        }

        return arrayComments
            .reduce((a, b) => a.concat(b))
            .sort((a, b) => b.emotionalStateId - a.emotionalStateId);
    }
}
