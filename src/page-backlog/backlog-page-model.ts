import { Store } from "../core/state/app-store";
import { BacklogRepository } from "../core/services/backlog.repository";
import { BacklogService } from "../core/services/backlog.service";
import { PtItem } from "../core/models/domain";
import { PresetType } from "../core/models/domain/types";
import { BehaviorSubject } from "rxjs";
import { PtNewItem } from "../shared/models/dto/pt-new-item";
import { ItemType } from "../core/constants";

export class BacklogPageModel {
    private store: Store = new Store();
    private backlogRepo: BacklogRepository = new BacklogRepository();
    private backlogService: BacklogService = new BacklogService(this.backlogRepo, this.store);

    public items$: BehaviorSubject<PtItem[]> = new BehaviorSubject<PtItem[]>([]);
    public currentPreset: PresetType = 'open';
    public itemTypesProvider = ItemType.List.map((t) => t.PtItemType);

    constructor(reqPreset: PresetType) {
        this.currentPreset = reqPreset;
    }

    public refresh(): Promise<PtItem[]> {
        return this.backlogService.getItems(this.currentPreset)
            .then(ptItems => {
                this.items$.next(ptItems);
                return ptItems;
            });
    }

    public onAddSave(newItem: PtNewItem) {
        if (this.store.value.currentUser) {
            this.backlogService.addNewPtItem(newItem, this.store.value.currentUser)
                .then((nextItem: PtItem) => {
                    this.items$.next([nextItem, ...this.items$.value]);
                });
        }
    }
}
