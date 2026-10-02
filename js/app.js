import {
    sampleTasks,
    generateTaskId
} from "./data.js";

import {
    isTaskTextValid,
    getTaskState,
    setTaskState
} from "./utility.js";

import {
    clearTaskMessage,
    showTaskMessage,
    updateCountDisplay
} from "./display.js";

const taskInput = document.querySelector("#taskInput");
const addTaskBtn = document.querySelector("#addTaskBtn");
const loadSamplesBtn = document.querySelector("#loadSamplesBtn");
const taskList = document.querySelector("#taskList");
const taskMessage = document.querySelector("#taskMessage");

const totalCount = document.querySelector("#totalCount");
const pendingCount = document.querySelector("#pendingCount");
const completedCount = document.querySelector("#completedCount");

export function createTaskElement(taskText, taskId) {
    const taskItem = document.createElement("li");

    taskItem.classList.add("task-item");

    taskItem.dataset.taskId = taskId;
    taskItem.dataset.state = "pending";

    const taskTextSpan = document.createElement("span");

    taskTextSpan.classList.add("task-text");

    taskTextSpan.textContent = taskText;

    const completeButton = document.createElement("button");

    completeButton.classList.add("complete-btn");
    completeButton.type = "button";
    completeButton.textContent = "Complete";

    const editButton = document.createElement("button");

    editButton.classList.add("edit-btn");
    editButton.type = "button";
    editButton.textContent = "Edit";

    const removeButton = document.createElement("button");

    removeButton.classList.add("remove-btn");
    removeButton.type = "button";
    removeButton.textContent = "Remove";

    taskItem.appendChild(taskTextSpan);
    taskItem.appendChild(completeButton);
    taskItem.appendChild(editButton);
    taskItem.appendChild(removeButton);

    return taskItem;
}

export function addTask(taskText) {
    if (!isTaskTextValid(taskText)) {
        showTaskMessage(
            taskMessage,
            "Task cannot be empty"
        );

        return;
    }

    const cleanTaskText = taskText.trim();
    const taskId = generateTaskId();
    const taskItem = createTaskElement(
        cleanTaskText,
        taskId
    );

    taskList.appendChild(taskItem);
    taskInput.value = "";
    clearTaskMessage(taskMessage);
    updateTaskCounts();
}

export function toggleTaskComplete(taskItem) {
    taskItem.classList.toggle("completed");

    if (taskItem.classList.contains("completed")) {
        setTaskState(taskItem, "completed");
    } else {
        setTaskState(taskItem, "pending");
    }

    updateTaskCounts();
}

export function beginTaskEdit(taskItem) {
    const taskTextSpan =
        taskItem.querySelector(".task-text");

    const editButton =
        taskItem.querySelector(".edit-btn");

    if (!taskTextSpan || !editButton) {
        return;
    }

    const currentText =
        taskTextSpan.textContent;

    const editInput =
        document.createElement("input");

    editInput.type = "text";
    editInput.classList.add("edit-input");
    editInput.value = currentText;

    taskTextSpan.replaceWith(editInput);
    editButton.textContent = "Save";
    editInput.focus();
}

export function saveTaskEdit(taskItem) {
    const editInput =
        taskItem.querySelector(".edit-input");

    const editButton =
        taskItem.querySelector(".edit-btn");

    if (!editInput || !editButton) {
        return;
    }

    const newText =
        editInput.value.trim();

    if (!isTaskTextValid(newText)) {
        showTaskMessage(
            taskMessage,
            "Task cannot be empty"
        );

        editInput.focus();
        return;
    }

    const newTaskText =
        document.createElement("span");

    newTaskText.classList.add("task-text");
    newTaskText.textContent = newText;
    editInput.replaceWith(newTaskText);
    editButton.textContent = "Edit";
    clearTaskMessage(taskMessage);
}

export function removeTask(taskItem) {
    taskItem.remove();
    updateTaskCounts();
}

export function updateTaskCounts() {
    const taskItems =
        taskList.querySelectorAll(".task-item");

    const total =
        taskItems.length;

    let pending = 0;
    let completed = 0;

    taskItems.forEach((taskItem) => {
        const state =
            getTaskState(taskItem);

        if (state === "completed") {
            completed += 1;
        } else {
            pending += 1;
        }
    });

    updateCountDisplay(
        totalCount,
        pendingCount,
        completedCount,
        {
            total,
            pending,
            completed
        }
    );
}

export function handleTaskListClick(event) {
    const clickedButton =
        event.target;

    const taskItem =
        clickedButton.closest(".task-item");

    if (!taskItem) {
        return;
    }

    if (
        clickedButton.classList.contains("complete-btn")
    ) {
        toggleTaskComplete(taskItem);
        return;
    }

    if (
        clickedButton.classList.contains("edit-btn")
    ) {
        const isEditing =
            taskItem.querySelector(".edit-input");

        if (isEditing) {
            saveTaskEdit(taskItem);
        } else {
            beginTaskEdit(taskItem);
        }
        return;
    }

    if (
        clickedButton.classList.contains("remove-btn")
    ) {
        removeTask(taskItem);
        return;
    }
}

export function loadSampleTasks() {
    const fragment =
        document.createDocumentFragment();

    sampleTasks.forEach((taskText) => {
        const taskId =
            generateTaskId();

        const taskItem =
            createTaskElement(
                taskText,
                taskId
            );
        fragment.appendChild(taskItem);
    });

    taskList.appendChild(fragment);
    clearTaskMessage(taskMessage);
    updateTaskCounts();
}

addTaskBtn.addEventListener(
    "click",
    () => {
        addTask(taskInput.value);
    }
);

loadSamplesBtn.addEventListener(
    "click",
    loadSampleTasks
);

taskInput.addEventListener(
    "keydown",
    (event) => {
        if (event.key === "Enter") {
            addTask(taskInput.value);
        }
    }
);

taskList.addEventListener(
    "click",
    handleTaskListClick
);

updateTaskCounts();
