import { EMPTY_STRING } from "../../core/helpers";

export class TasksScreenModel {
  constructor(props) {
    this.props = props;
    this.newTaskTitle = EMPTY_STRING;
  }

  onAddTapped() {
    const newTitle = this.newTaskTitle.trim();
    if (newTitle.length === 0) {
      return;
    }
    const newTask = {
      title: newTitle,
      completed: false,
    };
    this.props.addNewTask(newTask);

    this.newTaskTitle = EMPTY_STRING;
  }

  toggleTapped(taskId) {
    const taskUpdate = {
      task: this.getTaskById(taskId),
      toggle: true,
    };
    this.props.updateTask(taskUpdate);
  }

  onTaskUpdateRequested(taskId, newTitle) {
    const taskUpdate = {
      task: this.getTaskById(taskId),
      toggle: false,
      newTitle: newTitle,
    };
    this.props.updateTask(taskUpdate);
  }

  taskDelete(taskId) {
    const taskUpdate = {
      task: this.getTaskById(taskId),
      toggle: false,
      delete: true,
    };
    this.props.updateTask(taskUpdate);
  }

  getTaskById(taskId) {
    const task = this.props.tasks$.value.find((t) => t.id === taskId);
    return task;
  }
}
