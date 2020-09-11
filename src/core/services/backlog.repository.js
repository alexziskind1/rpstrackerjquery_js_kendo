import { CONFIG } from "../../config";

export class BacklogRepository {
  getFilteredBacklogUrl(currentPreset, currentUserId) {
    switch (currentPreset) {
      case "my":
        if (currentUserId) {
          return `${CONFIG.apiEndpoint}/myItems?userId=${currentUserId}`;
        } else {
          return `${CONFIG.apiEndpoint}/backlog`;
        }
      case "open":
        return `${CONFIG.apiEndpoint}/openItems`;
      case "closed":
        return `${CONFIG.apiEndpoint}/closedItems`;
      default:
        return `${CONFIG.apiEndpoint}/backlog`;
    }
  }

  getPtItemUrl(itemId) {
    return `${CONFIG.apiEndpoint}/item/${itemId}`;
  }

  postPtItemUrl() {
    return `${CONFIG.apiEndpoint}/item`;
  }

  putPtItemUrl(itemId) {
    return `${CONFIG.apiEndpoint}/item/${itemId}`;
  }

  deletePtItemUrl(itemId) {
    return `${CONFIG.apiEndpoint}/item/${itemId}`;
  }

  postPtTaskUrl() {
    return `${CONFIG.apiEndpoint}/task`;
  }

  putPtTaskUrl(taskId) {
    return `${CONFIG.apiEndpoint}/task/${taskId}`;
  }

  deletePtTaskUrl(itemId, taskId) {
    return `${CONFIG.apiEndpoint}/task/${itemId}/${taskId}`;
  }

  postPtCommentUrl() {
    return `${CONFIG.apiEndpoint}/comment`;
  }

  deletePtCommentUrl(commentId) {
    return `${CONFIG.apiEndpoint}/comment/${commentId}`;
  }

  getPtItems(currentPreset, currentUserId) {
    return fetch(
      this.getFilteredBacklogUrl(currentPreset, currentUserId)
    ).then((response) => response.json());
  }

  getPtItem(ptItemId) {
    return fetch(this.getPtItemUrl(ptItemId)).then((response) =>
      response.json()
    );
  }

  insertPtItem(item) {
    return fetch(this.postPtItemUrl(), {
      method: "POST",
      body: JSON.stringify({ item: item }),
      headers: this.getJSONHeader(),
    }).then((response) => response.json());
  }

  updatePtItem(item) {
    return fetch(this.putPtItemUrl(item.id), {
      method: "PUT",
      body: JSON.stringify({ item: item }),
      headers: this.getJSONHeader(),
    }).then((response) => response.json());
  }

  /*
    public deletePtItem(
        itemId: number,
        successHandler: () => void
    ) {
        this.http.delete(
            this.deletePtItemUrl(itemId)
        )
            .subscribe(successHandler);
    }
 */

  insertPtTask(task, ptItemId) {
    return fetch(this.postPtTaskUrl(), {
      method: "POST",
      body: JSON.stringify({ task: task, itemId: ptItemId }),
      headers: this.getJSONHeader(),
    }).then((response) => response.json());
  }

  updatePtTask(task, ptItemId) {
    return fetch(this.putPtTaskUrl(task.id), {
      method: "PUT",
      body: JSON.stringify({ task: task, itemId: ptItemId }),
      headers: this.getJSONHeader(),
    }).then((response) => response.json());
  }

  deletePtTask(task, ptItemId) {
    return fetch(this.deletePtTaskUrl(ptItemId, task.id), {
      method: "POST",
    }).then((response) => response.json());
  }

  insertPtComment(comment, ptItemId) {
    return fetch(this.postPtCommentUrl(), {
      method: "POST",
      body: JSON.stringify({ comment: comment, itemId: ptItemId }),
      headers: this.getJSONHeader(),
    }).then((response) => response.json());
  }

  /*
       public deletePtComment(
           ptCommentId: number,
           successHandler: () => void
       ) {
           this.http.delete(this.deletePtCommentUrl(ptCommentId))
               .subscribe(successHandler);
       }
       */

  getJSONHeader() {
    return new Headers({
      "Content-Type": "application/json",
    });
  }
}
