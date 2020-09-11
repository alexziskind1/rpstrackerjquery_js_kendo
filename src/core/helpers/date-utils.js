export function datesForTask(t) {
  t.dateCreated = new Date(t.dateCreated);
  t.dateDeleted = t.dateDeleted ? new Date(t.dateDeleted) : undefined;
  t.dateEnd = t.dateEnd ? new Date(t.dateEnd) : undefined;
  t.dateModified = new Date(t.dateModified);
  t.dateStart = t.dateStart ? new Date(t.dateStart) : undefined;
}

export function datesForComment(t) {
  t.dateCreated = new Date(t.dateCreated);
  t.dateDeleted = t.dateDeleted ? new Date(t.dateDeleted) : undefined;
  t.dateModified = new Date(t.dateModified);
}

export function formatDateEnUs(date) {
  return Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
}

export function datesForPtItem(i) {
  i.dateCreated = new Date(i.dateCreated);
  i.dateDeleted = i.dateDeleted ? new Date(i.dateDeleted) : undefined;
  i.dateModified = new Date(i.dateModified);
}
