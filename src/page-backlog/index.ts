import '../shared/style-imports';

import './backlog.css';

import $ from "jquery";
import "bootstrap/dist/js/bootstrap";
import '@progress/kendo-ui/js/kendo.button';
import '@progress/kendo-ui/js/kendo.dropdownlist';
import '@progress/kendo-ui/js/kendo.grid';

import { PtItem, PtUser } from "../core/models/domain";
import { ItemType } from "../core/constants";
import { getIndicatorClass } from "../shared/helpers/priority-styling";
import { BacklogPageModel } from './backlog-page-model';
import { PresetType, PtItemType } from '../core/models/domain/types';
import { pushUrl, getQueryParameter } from '../utils/url';
import { PtNewItem } from '../shared/models/dto/pt-new-item';

const reqPreset = getQueryParameter('preset') as PresetType;
const backlogPageModel = new BacklogPageModel(reqPreset);
let ptGrid: kendo.ui.Grid = null;

backlogPageModel.items$.subscribe(items => {
    $('#itemsTableBody').html(renderTableRows(items));
    if (items && ptGrid) {
        ptGrid.dataSource.data(items);
    }
});

function getIndicatorImage(item: PtItem) {
    return ItemType.imageResFromType(item.type);
}

function renderTableRows(items: PtItem[]): string {
    return items.map(i => renderTableRow(i)).join();
}
function renderTableRow(item: PtItem): string {
    return `
    <tr class="pt-table-row" data-id="${item.id}">
        <td><img src="${getIndicatorImage(item)}" class="backlog-icon"></td>
        <td><img src="${item.assignee.avatar}"
                class="li-avatar rounded mx-auto d-block" /></td>
        <td><span class="li-title">${item.title}</span></td>
        <td><span class="${'badge ' + getIndicatorClass(item.priority)}">${item.priority}</span></td>
        <td><span class="li-estimate">${item.estimate}</span></td>
        <td><span class="li-date">${item.dateCreated.toDateString()}</span></td>
    </tr>
    `;
}

function getItemTypeCellMarkup(item: PtItem) {
    return `<img src="${getIndicatorImage(item)}" class="backlog-icon" />`;
}

function getAssigneeCellMarkup(item: PtItem) {
    const user = item.assignee;
    return `
    <div>
      <img src="${user.avatar}" class="li-avatar rounded mx-auto" />
      <span style="margin-left: 10px;">${user.fullName}</span>
    </div>
  `;
}
function getPriorityCellMarkup(item: PtItem) {
    return `<span class="${'badge ' + getIndicatorClass(item.priority)}">${
        item.priority
        }</span>`;
}
function getCreatedDateCellMarkup(item: PtItem) {
    return `<span class="li-date">${item.dateCreated.toDateString()}</span>`;
}

function onGridChange(e: kendo.ui.GridChangeEvent) {
    const item = ptGrid.dataItem(e.sender.select()).toJSON() as PtItem;
    window.location.href = `/page-detail/detail.html?screen=details&itemId=${item.id}`;
}

$(() => {

    $('#btnAddNewItem').kendoButton({ icon: 'plus' });

    const newItemTypeSelectObj = $('#newItemType');
    $.each(backlogPageModel.itemTypesProvider, (key, value) => {
        newItemTypeSelectObj.append($("<option></option>")
            .attr("value", value)
            .text(value));
    });
    newItemTypeSelectObj.kendoDropDownList();

    $('.btn-backlog-filter').click((e) => {
        const selPreset = $(e.currentTarget).attr('data-preset') as PresetType;
        pushUrl('', 'page-backlog/backlog.html', '?preset=' + selPreset);
        backlogPageModel.currentPreset = selPreset;
        backlogPageModel.refresh();
    });

    $('#btnAddItemSave').click(() => {
        const newTitle = $('#newItemTitle').val() as string;
        const newDescription = $('#newItemDescription').val() as string;
        const newItemType = $('#newItemType').val() as PtItemType;
        const newItem: PtNewItem = {
            title: newTitle,
            description: newDescription,
            typeStr: newItemType
        };
        backlogPageModel.onAddSave(newItem);
    });

    $(document).on("click", "#itemsTableBody tr", (e) => {
        const itemId = $(e.currentTarget).attr('data-id');
        window.location.href = `/page-detail/detail.html?screen=details&itemId=${itemId}`;
    });

    const ptGridOptions: kendo.ui.GridOptions = {
        dataSource: {
            data: [],
            pageSize: 10
        },
        height: 410,
        sortable: true,
        columnMenu: true,
        selectable: true,
        change: onGridChange,
        pageable: {
            refresh: true,
            pageSizes: true,
            buttonCount: 5
        },
        columns: [
            { field: 'type', title: ' ', menu: false, template: getItemTypeCellMarkup, width: 45 },
            { field: 'assignee', title: 'Assignee', template: getAssigneeCellMarkup, width: 260 },
            { field: 'title', title: 'Title' },
            { field: 'priority', title: 'Priority', template: getPriorityCellMarkup, width: 100 },
            { field: 'estimate', title: 'Estimate', width: 100 },
            { field: 'dateCreated', title: 'Created', template: getCreatedDateCellMarkup, width: 160, filterable: {} },
        ]
    };
    ptGrid = $('#grid').kendoGrid(ptGridOptions).data('kendoGrid');

    backlogPageModel.refresh();
});





