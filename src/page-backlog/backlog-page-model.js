import { BehaviorSubject } from "rxjs";

import { Store } from "../core/state/app-store";
import { BacklogRepository } from "../core/services/backlog.repository";
import { BacklogService } from "../core/services/backlog.service";
import { ItemType } from "../core/constants";

export class BacklogPageModel {
  constructor(reqPreset) {
    this.store = new Store();
    this.backlogRepo = new BacklogRepository();
    this.backlogService = new BacklogService(this.backlogRepo, this.store);

    this.items$ = new BehaviorSubject([]);
    this.currentPreset = "open";
    this.itemTypesProvider = ItemType.List.map((t) => t.PtItemType);

    this.currentPreset = reqPreset;
  }

  refresh() {
    return this.backlogService.getItems(this.currentPreset).then((ptItems) => {
      this.items$.next(ptItems);
      return ptItems;
    });
  }

  onAddSave(newItem) {
    if (this.store.value.currentUser) {
      this.backlogService
        .addNewPtItem(newItem, this.store.value.currentUser)
        .then((nextItem) => {
          this.items$.next([nextItem, ...this.items$.value]);
        });
    }
  }
}
