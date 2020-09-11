import { BehaviorSubject } from "rxjs";

import { PtComment, PtUser } from "../../core/models/domain";
import { PtNewComment } from "../../shared/models/dto/pt-new-comment";
import { EMPTY_STRING } from "../../core/helpers";

export interface PtItemChitchatScreenProps {
    comments$: BehaviorSubject<PtComment[]>;
    currentUser: PtUser;
    addNewComment: (newComment: PtNewComment) => void;
}

export class ChitchatScreenModel {
    public newCommentText: string = EMPTY_STRING;
    constructor(public props: PtItemChitchatScreenProps) { }

    public onAddTapped() {
        const newTitle = this.newCommentText.trim();
        if (newTitle.length === 0) {
            return;
        }
        const newComment: PtNewComment = {
            title: newTitle
        };
        this.props.addNewComment(newComment);

        this.newCommentText = EMPTY_STRING;
    }
}
