import { Observable } from "rxjs";

import { PtItem, PtUser } from "../../core/models/domain";
import { PtItemDetailsEditFormModel, ptItemToFormModel } from "../../shared/models/forms/pt-item-details-edit-form";
import { ItemType } from "../../core/constants";
import { PT_ITEM_STATUSES } from "../../core/constants";
import { PT_ITEM_PRIORITIES } from "../../core/constants";

export interface PtItemDetailsScreenProps {
    item: PtItem;
    itemSaved: (item: PtItem) => void;
    usersRequested: () => void;
    users$: Observable<PtUser[]>;
}

export class DetailsScreenModel {

    public itemForm: PtItemDetailsEditFormModel;
    public itemTypesProvider = ItemType.List.map((t) => t.PtItemType);
    public statusesProvider = PT_ITEM_STATUSES;
    public prioritiesProvider = PT_ITEM_PRIORITIES;
    public selectedAssignee: PtUser | undefined;
    private users: PtUser[] = [];

    constructor(public props: PtItemDetailsScreenProps) {
        this.itemForm = ptItemToFormModel(this.props.item);
        this.selectedAssignee = this.props.item.assignee;
        this.props.users$.subscribe(users => this.users = users);
    }

    public notifyUpdateItem() {
        if (!this.itemForm) {
            return;
        }
        const updatedItem = this.getUpdatedItem(this.props.item, this.itemForm, this.selectedAssignee);
        this.onItemSaved(updatedItem);
    }

    private getUpdatedItem(item: PtItem, itemForm: PtItemDetailsEditFormModel, assignee: PtUser): PtItem {
        const updatedItem = Object.assign({}, item, {
            title: itemForm.title,
            description: itemForm.description,
            type: itemForm.typeStr,
            status: itemForm.statusStr,
            priority: itemForm.priorityStr,
            estimate: itemForm.estimate,
            assignee: assignee
        });
        return updatedItem;
    }

    private onItemSaved(item: PtItem) {
        this.props.itemSaved(item);
    }

    public onUsersRequested() {
        this.props.usersRequested();
    }

    public selectUserById(userId: number) {
        this.selectedAssignee = this.users.find(u => u.id === userId);
        this.itemForm.assigneeName = this.selectedAssignee.fullName;
        this.notifyUpdateItem();
    }
}
