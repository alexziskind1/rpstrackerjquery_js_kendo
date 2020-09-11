import { ptItemToFormModel } from "../../shared/models/forms/pt-item-details-edit-form";
import { ItemType } from "../../core/constants";
import { PT_ITEM_STATUSES } from "../../core/constants";
import { PT_ITEM_PRIORITIES } from "../../core/constants";

export class DetailsScreenModel {
  constructor(props) {
    this.props = props;
    this.itemTypesProvider = ItemType.List.map((t) => t.PtItemType);
    this.statusesProvider = PT_ITEM_STATUSES;
    this.prioritiesProvider = PT_ITEM_PRIORITIES;
    this.users = [];
    this.itemForm = ptItemToFormModel(this.props.item);
    this.selectedAssignee = this.props.item.assignee;
    this.props.users$.subscribe((users) => (this.users = users));
  }

  notifyUpdateItem() {
    if (!this.itemForm) {
      return;
    }
    const updatedItem = this.getUpdatedItem(
      this.props.item,
      this.itemForm,
      this.selectedAssignee
    );
    this.onItemSaved(updatedItem);
  }

  getUpdatedItem(item, itemForm, assignee) {
    const updatedItem = Object.assign({}, item, {
      title: itemForm.title,
      description: itemForm.description,
      type: itemForm.typeStr,
      status: itemForm.statusStr,
      priority: itemForm.priorityStr,
      estimate: itemForm.estimate,
      assignee: assignee,
    });
    return updatedItem;
  }

  onItemSaved(item) {
    this.props.itemSaved(item);
  }

  onUsersRequested() {
    this.props.usersRequested();
  }

  selectUserById(userId) {
    this.selectedAssignee = this.users.find((u) => u.id === userId);
    this.itemForm.assigneeName = this.selectedAssignee.fullName;
    this.notifyUpdateItem();
  }
}
