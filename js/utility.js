export function isTaskTextValid(taskText) {
    return taskText.trim().length > 0;
}

export function getTaskState(taskItem) {
    return taskItem.dataset.state;
}

export function setTaskState(taskItem, state) {
    taskItem.dataset.state = state;
}