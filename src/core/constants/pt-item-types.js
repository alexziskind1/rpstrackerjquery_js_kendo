const PT_ITEM_TYPE_PBI = "PBI";
const PT_ITEM_TYPE_BUG = "Bug";
const PT_ITEM_TYPE_CHORE = "Chore";
const PT_ITEM_TYPE_IMPEDIMENT = "Impediment";

export class ItemType {
  static get Pbi() {
    return this.itPbi;
  }

  static get Bug() {
    return this.itBug;
  }

  static get Chore() {
    return this.itChore;
  }

  static get Impediment() {
    return this.itImpediment;
  }

  static get List() {
    return [ItemType.Bug, ItemType.Pbi, ItemType.Chore, ItemType.Impediment];
  }

  static indicatorClassFromType(ptItemType) {
    switch (ptItemType) {
      case PT_ITEM_TYPE_PBI:
        return "indicator-pbi";
      case PT_ITEM_TYPE_BUG:
        return "indicator-bug";
      case PT_ITEM_TYPE_CHORE:
        return "indicator-chore";
      case PT_ITEM_TYPE_IMPEDIMENT:
        return "indicator-impediment";
      default:
        return "";
    }
  }

  static imageResFromType(ptItemType) {
    switch (ptItemType) {
      case PT_ITEM_TYPE_PBI:
        return "/assets/img/icon_pbi.png";
      case PT_ITEM_TYPE_BUG:
        return "/assets/img/icon_bug.png";
      case PT_ITEM_TYPE_CHORE:
        return "/assets/img/icon_chore.png";
      case PT_ITEM_TYPE_IMPEDIMENT:
        return "/assets/img/icon_impediment.png";
      default:
        return "";
    }
  }

  get PtItemType() {
    return this.ptItemType;
  }

  constructor(ptItemType) {
    this.ptItemType = ptItemType;
  }

  static fromString(typeStr) {
    return ItemType.List.find((i) => i.PtItemType === typeStr);
  }

  getPtTypeImage() {
    return ItemType.imageResFromType(this.PtItemType);
  }

  getIndicatorClass() {
    return ItemType.indicatorClassFromType(this.PtItemType);
  }
}

ItemType.itPbi = new ItemType(PT_ITEM_TYPE_PBI);
ItemType.itBug = new ItemType(PT_ITEM_TYPE_BUG);
ItemType.itChore = new ItemType(PT_ITEM_TYPE_CHORE);
ItemType.itImpediment = new ItemType(PT_ITEM_TYPE_IMPEDIMENT);
