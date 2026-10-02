let taskCounter = 0;

export const sampleTasks = [
    "Review DOM selectors",
    "Practice createElement",
    "Study event delegation"
];

export function generateTaskId() {
    taskCounter += 1;

    return `task-${taskCounter}`;
}