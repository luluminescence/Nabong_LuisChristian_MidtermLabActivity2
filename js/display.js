export function clearTaskMessage(taskMessage) {
    taskMessage.textContent = "";
}

export function showTaskMessage(taskMessage, message) {
    taskMessage.textContent = message;
}

export function updateCountDisplay(
    totalCount,
    pendingCount,
    completedCount,
    counts
) {
    const {
        total,
        pending,
        completed
    } = counts;

    totalCount.textContent = total;
    pendingCount.textContent = pending;
    completedCount.textContent = completed;
}