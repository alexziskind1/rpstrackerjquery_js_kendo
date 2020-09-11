export function ptItemToFormModel(item) {
  return {
    title: item.title ? item.title : "",
    description: item.description ? item.description : "",
    typeStr: item.type,
    statusStr: item.status,
    estimate: item.estimate,
    priorityStr: item.priority,
    assigneeName: item.assignee ? item.assignee.fullName : "unassigned",
  };
}
