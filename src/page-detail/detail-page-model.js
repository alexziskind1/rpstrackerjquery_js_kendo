import { BehaviorSubject } from "rxjs";

import { Store } from "../core/state/app-store";
import { BacklogRepository } from "../core/services/backlog.repository";
import { BacklogService } from "../core/services/backlog.service";
import { PtUserService } from "../core/services/pt-user-service";

export class DetailPageModel {
  constructor(reqScreen, itemId) {
    this.store = new Store();
    this.backlogRepo = new BacklogRepository();
    this.backlogService = new BacklogService(this.backlogRepo, this.store);
    this.ptUserService = new PtUserService(this.store);

    this.item$ = new BehaviorSubject(null);
    this.users$ = this.store.select("users");
    this.tasks$ = new BehaviorSubject([]);
    this.comments$ = new BehaviorSubject([]);

    this.itemId = itemId || 0;
    this.currentScreen = reqScreen || "details";
    this.currentUser = this.store.value.currentUser;
  }

  refresh() {
    return this.backlogService.getPtItem(this.itemId).then((item) => {
      this.item$.next(item);
      this.tasks$.next(item.tasks);
      this.comments$.next(item.comments);
    });
  }

  onItemSaved(item) {
    this.backlogService.updatePtItem(item).then((updateItem) => {
      this.item$.next(updateItem);
    });
  }

  onUsersRequested() {
    this.ptUserService.fetchUsers();
  }

  onAddNewTask(newTask) {
    if (this.item$.value) {
      this.backlogService
        .addNewPtTask(newTask, this.item$.value)
        .then((nextTask) => {
          this.tasks$.next([nextTask].concat(this.tasks$.value));
        });
    }
  }

  onUpdateTask(taskUpdate) {
    if (this.item$.value) {
      if (taskUpdate.delete) {
        this.backlogService
          .deletePtTask(this.item$.value, taskUpdate.task)
          .then((ok) => {
            if (ok) {
              const newTasks = this.tasks$.value.filter((task) => {
                if (task.id !== taskUpdate.task.id) {
                  return task;
                }
              });
              this.tasks$.next(newTasks);
            }
          });
      } else {
        this.backlogService
          .updatePtTask(
            this.item$.value,
            taskUpdate.task,
            taskUpdate.toggle,
            taskUpdate.newTitle
          )
          .then((updatedTask) => {
            const newTasks = this.tasks$.value.map((task) => {
              if (task.id === updatedTask.id) {
                return updatedTask;
              } else {
                return task;
              }
            });
            this.tasks$.next(newTasks);
          });
      }
    }
  }

  onAddNewComment(newComment) {
    if (this.item$.value) {
      this.backlogService
        .addNewPtComment(newComment, this.item$.value)
        .then((nextComment) => {
          this.comments$.next([nextComment].concat(this.comments$.value));
        });
    }
  }
}
