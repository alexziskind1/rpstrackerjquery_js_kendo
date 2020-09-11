import { BehaviorSubject, Observable } from "rxjs";

import { Store } from "../core/state/app-store";
import { BacklogRepository } from "../core/services/backlog.repository";
import { BacklogService } from "../core/services/backlog.service";
import { PtUserService } from "../core/services/pt-user-service";
import { PtItem, PtUser, PtTask, PtComment } from "../core/models/domain";
import { DetailScreenType } from "../shared/models/ui/types/detail-screens";
import { PtNewTask } from "../shared/models/dto/pt-new-task";
import { PtTaskUpdate } from "../shared/models/dto/pt-task-update";
import { PtNewComment } from "../shared/models/dto/pt-new-comment";

export class DetailPageModel {
    private store: Store = new Store();
    private backlogRepo: BacklogRepository = new BacklogRepository();
    private backlogService: BacklogService = new BacklogService(this.backlogRepo, this.store);
    private ptUserService: PtUserService = new PtUserService(this.store);

    public currentUser: PtUser;
    public itemId: number = 0;
    public currentScreen: DetailScreenType = 'details';
    public item$: BehaviorSubject<PtItem> = new BehaviorSubject<PtItem>(null);
    public users$: Observable<PtUser[]> = this.store.select<PtUser[]>('users');
    public tasks$: BehaviorSubject<PtTask[]> = new BehaviorSubject<PtTask[]>([]);
    public comments$: BehaviorSubject<PtComment[]> = new BehaviorSubject<PtComment[]>([]);

    constructor(reqScreen: DetailScreenType, itemId: number) {
        this.itemId = itemId;
        this.currentScreen = reqScreen;
        this.currentUser = this.store.value.currentUser;
    }

    public refresh() {
        return this.backlogService.getPtItem(this.itemId)
            .then(item => {
                this.item$.next(item);
                this.tasks$.next(item.tasks);
                this.comments$.next(item.comments);
            });
    }

    public onItemSaved(item: PtItem) {
        this.backlogService.updatePtItem(item)
            .then((updateItem: PtItem) => {
                this.item$.next(updateItem);
            });
    }

    public onUsersRequested() {
        this.ptUserService.fetchUsers();
    }

    public onAddNewTask(newTask: PtNewTask) {
        if (this.item$.value) {
            this.backlogService.addNewPtTask(newTask, this.item$.value).then(nextTask => {
                this.tasks$.next([nextTask].concat(this.tasks$.value));
            });
        }
    }

    public onUpdateTask(taskUpdate: PtTaskUpdate) {
        if (this.item$.value) {
            if (taskUpdate.delete) {
                this.backlogService.deletePtTask(this.item$.value, taskUpdate.task).then(ok => {
                    if (ok) {
                        const newTasks = this.tasks$.value.filter(task => {
                            if (task.id !== taskUpdate.task.id) {
                                return task;
                            }
                        });
                        this.tasks$.next(newTasks);
                    }
                });
            } else {
                this.backlogService.updatePtTask(this.item$.value, taskUpdate.task, taskUpdate.toggle, taskUpdate.newTitle).then(updatedTask => {
                    const newTasks = this.tasks$.value.map(task => {
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

    public onAddNewComment(newComment: PtNewComment) {
        if (this.item$.value) {
            this.backlogService.addNewPtComment(newComment, this.item$.value).then(nextComment => {
                this.comments$.next([nextComment].concat(this.comments$.value));
            });
        }
    }
}
