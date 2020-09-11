import { EMPTY_STRING } from "../../core/helpers";

export class ChitchatScreenModel {
  constructor(props) {
    this.props = props;
    this.newCommentText = EMPTY_STRING;
  }

  onAddTapped() {
    const newTitle = this.newCommentText.trim();
    if (newTitle.length === 0) {
      return;
    }
    const newComment = {
      title: newTitle,
    };
    this.props.addNewComment(newComment);

    this.newCommentText = EMPTY_STRING;
  }
}
