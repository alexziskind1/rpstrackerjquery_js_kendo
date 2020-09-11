import $ from "jquery";

let tasksScreenModel = undefined;

$(document)
  .on("blur", "#inputNewTaskTitle", (e) => {
    //save changes
    tasksScreenModel.newTaskTitle = $(e.currentTarget).val();
  })
  .on("keyup", "#inputNewTaskTitle", (e) => {
    const inputObj = $(e.currentTarget);
    const newValue = inputObj.val();
    if (newValue.trim().length === 0) {
      $("#btnTaskAdd").attr("disabled", "disabled");
    } else {
      $("#btnTaskAdd").removeAttr("disabled");
    }
  })
  .on("click", "#btnTaskAdd", () => {
    tasksScreenModel.onAddTapped();
    $("#inputNewTaskTitle").val("");
  })
  .on("click", ".checkbox-pt-task", (e) => {
    const taskId = Number($(e.currentTarget).attr("data-task-id"));
    tasksScreenModel.toggleTapped(taskId);
  })
  .on("click", ".btn-task-delete", (e) => {
    const taskId = Number($(e.currentTarget).attr("data-task-id"));
    tasksScreenModel.taskDelete(taskId);
  })
  .on("blur", ".input-task-title", (e) => {
    const inputObj = $(e.currentTarget);
    const taskId = Number(inputObj.attr("data-task-id"));
    const newValue = inputObj.val();
    tasksScreenModel.onTaskUpdateRequested(taskId, newValue);
  });

export function renderScreenTasks(model) {
  tasksScreenModel = model;
  tasksScreenModel.props.tasks$.subscribe((tasks) => {
    if (tasks.length > 0) {
      renderTasks(tasks);
    }
  });
  const tasksTemplate = $("#tasksTemplate").html();
  const renderedHtml = tasksTemplate;
  $("#tasksScreenContainer").html(renderedHtml);
}

export function renderTasks(tasks) {
  const listTasksObj = $("#listTasks").empty();
  $.each(tasks, (key, task) => {
    listTasksObj.append(
      $(
        `
            <div class="input-group mb-3 col-sm-6">
                <div class="input-group-prepend">
                    <div class="input-group-text">
                        <input type="checkbox" class="checkbox-pt-task" ${
                          task.completed ? "checked" : ""
                        } data-task-id="${task.id}"
                            name="${"checked" + task.id}" />
                    </div>
                </div>
                <input value="${
                  task.title
                }" (ngModelChange)="taskTitleChange(task, $event)" data-task-id="${
          task.id
        }"
                    type="text" class="form-control input-task-title" aria-label="Text input with checkbox" name="${
                      "tasktitle" + task.id
                    }" />
        
                <div class="input-group-append">
                    <button class="btn btn-danger btn-task-delete" type="button" data-task-id="${
                      task.id
                    }">Delete</button>
                </div>
            </div>
            `
      )
    );
  });
}
