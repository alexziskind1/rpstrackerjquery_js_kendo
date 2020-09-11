import $ from "jquery";

import "./chitchat-screen.css";

let chitchatScreenModel = undefined;

$(document)
  .on("blur", "#inputNewCommentText", (e) => {
    //save changes
    chitchatScreenModel.newCommentText = $(e.currentTarget).val();
  })
  .on("keyup", "#inputNewCommentText", (e) => {
    const inputObj = $(e.currentTarget);
    const newValue = inputObj.val();
    if (newValue.trim().length === 0) {
      $("#btnCommentAdd").attr("disabled", "disabled");
    } else {
      $("#btnCommentAdd").removeAttr("disabled");
    }
  })
  .on("click", "#btnCommentAdd", () => {
    chitchatScreenModel.onAddTapped();
    $("#inputNewCommentText").val("");
  });

export function renderScreenChitchat(model) {
  chitchatScreenModel = model;

  chitchatScreenModel.props.comments$.subscribe((comments) => {
    if (comments.length > 0) {
      renderComments(comments);
    }
  });

  const commentsTemplate = $("#chitchatTemplate").html();
  const renderedHtml = commentsTemplate;
  $("#chitchatScreenContainer").html(renderedHtml);
  $("#imgCurrentUserAvatar").attr(
    "src",
    chitchatScreenModel.props.currentUser.avatar
  );
}

export function renderComments(comments) {
  const listCommentsObj = $("#listComments").empty();
  $.each(comments, (key, comment) => {
    listCommentsObj.append(
      $(
        `
            <li class="media chitchat-item">
                <img src="${
                  comment.user.avatar
                }" class="mr-3 li-avatar rounded" />
                <div class="media-body">
                    <h6 class="mt-0 mb-1"><span>${
                      comment.user.fullName
                    }</span><span class="li-date">${comment.dateCreated.toDateString()}</span></h6>
        
                    <span type="text" class="chitchat-text ">${
                      comment.title
                    }</span>
                </div>
            </li>
            `
      )
    );
  });
}
