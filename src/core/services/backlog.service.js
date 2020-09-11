import { getUserAvatarUrl } from "../helpers";
import { CONFIG } from "../../config";
import {
  datesForPtItem,
  datesForTask,
  datesForComment,
} from "../helpers/date-utils";
import { PriorityEnum, StatusEnum } from "../models/domain/enums";

export const tempCurrentUser = {
  avatar: getUserAvatarUrl(CONFIG.apiEndpoint, 21),
  dateCreated: new Date(),
  dateModified: new Date(),
  fullName: "Alex Ziskind",
  id: 21,
};

export class BacklogService {
  get currentPreset() {
    return this.store.value.selectedPreset;
  }

  get currentUserId() {
    if (this.store.value.currentUser) {
      return this.store.value.currentUser.id;
    } else {
      return undefined;
    }
  }

  constructor(repo, store) {
    this.repo = repo;
    this.store = store;
    this.store.value.currentUser = tempCurrentUser;
  }

  getItems(preset) {
    return this.repo.getPtItems(preset, this.currentUserId).then((ptItems) => {
      ptItems.forEach((i) => {
        datesForPtItem(i);
        this.setUserAvatarUrl(i.assignee);
        i.comments.forEach((c) => this.setUserAvatarUrl(c.user));
      });
      return ptItems;
    });
  }

  getPtItem(id) {
    return this.repo.getPtItem(id).then((ptItem) => {
      datesForPtItem(ptItem);
      this.setUserAvatarUrl(ptItem.assignee);
      ptItem.comments.forEach((c) => {
        this.setUserAvatarUrl(c.user);
        datesForComment(c);
      });
      ptItem.tasks.forEach((t) => datesForTask(t));
      return ptItem;
    });
  }

  addNewPtItem(newItem, assignee) {
    const item = {
      id: 0,
      title: newItem.title,
      description: newItem.description,
      type: newItem.typeStr,
      estimate: 0,
      priority: PriorityEnum.Medium,
      status: StatusEnum.Open,
      assignee: assignee,
      tasks: [],
      comments: [],
      dateCreated: new Date(),
      dateModified: new Date(),
    };
    return new Promise((resolve, reject) => {
      this.repo.insertPtItem(item).then((nextItem) => {
        datesForPtItem(nextItem);
        this.setUserAvatar(nextItem.assignee);

        nextItem.tasks.forEach((t) => datesForTask(t));
        nextItem.comments.forEach((c) => datesForComment(c));
        resolve(nextItem);
      });
    });
  }

  updatePtItem(item) {
    return this.repo.updatePtItem(item);
  }

  addNewPtTask(newTask, currentItem) {
    const task = {
      id: 0,
      title: newTask.title,
      completed: false,
      dateCreated: new Date(),
      dateModified: new Date(),
      dateStart: newTask.dateStart ? newTask.dateStart : undefined,
      dateEnd: newTask.dateEnd ? newTask.dateEnd : undefined,
    };
    return new Promise((resolve, reject) => {
      this.repo.insertPtTask(task, currentItem.id).then((nextTask) => {
        datesForTask(nextTask);
        resolve(nextTask);
      });
    });
  }

  updatePtTask(currentItem, task, toggle, newTitle) {
    const taskToUpdate = {
      id: task.id,
      title: newTitle ? newTitle : task.title,
      completed: toggle ? !task.completed : task.completed,
      dateCreated: task.dateCreated,
      dateModified: new Date(),
      dateStart: task.dateStart ? task.dateStart : undefined,
      dateEnd: task.dateEnd ? task.dateEnd : undefined,
    };
    return new Promise((resolve, reject) => {
      this.repo
        .updatePtTask(taskToUpdate, currentItem.id)
        .then((updatedTask) => {
          datesForTask(updatedTask);
          resolve(updatedTask);
        });
    });
  }

  deletePtTask(currentItem, task) {
    return new Promise((resolve, reject) => {
      this.repo.deletePtTask(task, currentItem.id).then((ok) => {
        const updatedTasks = currentItem.tasks.filter((t) => {
          if (t.id !== task.id) {
            return t;
          }
        });
        currentItem.tasks = updatedTasks;
        resolve(ok);
      });
    });
  }

  addNewPtComment(newComment, currentItem) {
    const comment = {
      id: 0,
      title: newComment.title,
      user: this.store.value.currentUser,
      dateCreated: new Date(),
      dateModified: new Date(),
    };
    return new Promise((resolve, reject) => {
      this.repo.insertPtComment(comment, currentItem.id).then((nextComment) => {
        datesForComment(nextComment);
        resolve(nextComment);
      });
    });
  }

  setUserAvatarUrl(user) {
    if (user) {
      user.avatar = `${CONFIG.apiEndpoint}/photo/${user.id}`;
    }
  }

  setUserAvatar(user) {
    user.avatar = getUserAvatarUrl(CONFIG.apiEndpoint, user.id);
  }
}
