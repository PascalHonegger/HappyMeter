import { Component, Input } from '@angular/core';

import { CommentWithDetails } from './../model/comment-with-details.model';

@Component({
    selector: 'comment-list',
    templateUrl: 'comment-list.component.html',
    styleUrls: ['comment-list.component.scss']
})
export class CommentListComponent {
    @Input()
    public set commentsWithEmotionAndTimestamp(value: CommentWithDetails[]) {
        if (!value) {
            this.comments = null;
        } else {
            this.comments = value.sort((a, b) => b.emotionalStateId - a.emotionalStateId);
        }
    }
    public comments: CommentWithDetails[];

    @Input()
    public fullDate: boolean = false;

    public commentIdFunc(index: number, item: CommentWithDetails) {
        return item.emotionalStateId;
    }
}
