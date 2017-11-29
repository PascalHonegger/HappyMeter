import { Component, Input } from '@angular/core';

import { CommentWithDetails } from './../model/comment-with-details.model';

@Component({
    selector: 'comment-list',
    templateUrl: 'comment-list.component.html',
    styleUrls: ['comment-list.component.scss']
})
export class CommentListComponent {
    @Input()
    public commentsWithEmotionAndTimestamp: CommentWithDetails[];

    public commentIdFunc(index: number, item: CommentWithDetails) {
        return item.emotionalStateId;
    }
}
