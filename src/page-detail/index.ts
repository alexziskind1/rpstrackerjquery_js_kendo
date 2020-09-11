import '../shared/style-imports';

import $ from "jquery";
import "bootstrap/dist/js/bootstrap";
import '@progress/kendo-ui/js/kendo.tabstrip';

import { PtItem } from "../core/models/domain";
import { pushUrl, getQueryParameter } from '../utils/url';
import { DetailScreenType } from "../shared/models/ui/types/detail-screens";
import { DetailPageModel } from "./detail-page-model";
import { renderScreenDetails } from "./screens/details-screen";
import { PtItemDetailsScreenProps, DetailsScreenModel } from "./screens/details-screen-model";
import { PtItemTasksScreenProps, TasksScreenModel } from "./screens/tasks-screen-model";
import { renderScreenTasks } from "./screens/tasks-screen";
import { PtItemChitchatScreenProps, ChitchatScreenModel } from "./screens/chitchat-screen-model";
import { renderScreenChitchat } from "./screens/chitchat-screen";

const reqScreen = getQueryParameter('screen') as DetailScreenType;
const reqItemId = Number(getQueryParameter('itemId'));
const detailPageModel = new DetailPageModel(reqScreen, reqItemId);

function resetAllScreens() {
    $("#detailsScreenContainer").empty();
    $("#tasksScreenContainer").empty();
    $("#chitchatScreenContainer").empty();
}

function createScreenDetails(detailPageModel: DetailPageModel) {
    const modelProps: PtItemDetailsScreenProps = {
        item: detailPageModel.item$.value,
        users$: detailPageModel.users$,
        itemSaved: (item) => detailPageModel.onItemSaved(item),
        usersRequested: () => detailPageModel.onUsersRequested()
    };

    const detailsScreenModel: DetailsScreenModel = new DetailsScreenModel(modelProps);

    renderScreenDetails(detailsScreenModel);
}

function createScreenTasks(detailPageModel: DetailPageModel) {
    const modelProps: PtItemTasksScreenProps = {
        tasks$: detailPageModel.tasks$,
        addNewTask: (newTask) => detailPageModel.onAddNewTask(newTask),
        updateTask: (taskUpdate) => detailPageModel.onUpdateTask(taskUpdate)
    };

    const tasksScreenModel: TasksScreenModel = new TasksScreenModel(modelProps);

    renderScreenTasks(tasksScreenModel);
}

function createScreenChitchat(detailPageModel: DetailPageModel) {
    const modelProps: PtItemChitchatScreenProps = {
        comments$: detailPageModel.comments$,
        currentUser: detailPageModel.currentUser,
        addNewComment: (newComment) => detailPageModel.onAddNewComment(newComment)
    };

    const chitchatScreenModel: ChitchatScreenModel = new ChitchatScreenModel(modelProps);

    renderScreenChitchat(chitchatScreenModel);
}

detailPageModel.item$.subscribe(item => {
    if (item) {
        renderPageChanges(item);
        resetAllScreens();
        switch (detailPageModel.currentScreen) {
            case 'details':
                createScreenDetails(detailPageModel);
                break;
            case 'tasks':
                createScreenTasks(detailPageModel);
                break;
            case 'chitchat':
                createScreenChitchat(detailPageModel);
                break;
            default:
                createScreenDetails(detailPageModel);
        }
    }
});

$(() => {

    const tabstripOptions: kendo.ui.TabStripOptions = {
        select: (e: kendo.ui.TabStripSelectEvent) => {
            const selScreen = e.item.textContent.trim().toLowerCase() as DetailScreenType;
            pushUrl('', 'page-detail/detail.html', `?screen=${selScreen}&itemId=${detailPageModel.itemId}`);
            detailPageModel.currentScreen = selScreen;
            detailPageModel.refresh();
        }
    };
    // Set the active tab BEFORE making a tabstrip
    $(`[data-tab-title="${detailPageModel.currentScreen}"]`).addClass('k-state-active');
    $('#tabstrip').kendoTabStrip(tabstripOptions);

    $('.btn-screen-switch').click((e) => {
        const selScreen = $(e.currentTarget).attr('data-screen') as DetailScreenType;
        pushUrl('', 'page-detail/detail.html', `?screen=${selScreen}&itemId=${detailPageModel.itemId}`);
        detailPageModel.currentScreen = selScreen;
        detailPageModel.refresh();
    });
});


function renderPageChanges(item: PtItem) {
    $('#itemTitle').text(item.title);
}

detailPageModel.refresh();
