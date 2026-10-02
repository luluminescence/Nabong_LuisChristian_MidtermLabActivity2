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


/*
    DOM ELEMENTS
*/

const taskInput = document.querySelector("#taskInput");
const addTaskBtn = document.querySelector("#addTaskBtn");
const loadSamplesBtn = document.querySelector("#loadSamplesBtn");
const taskList = document.querySelector("#taskList");
const taskMessage = document.querySelector("#taskMessage");

const totalCount = document.querySelector("#totalCount");
const pendingCount = document.querySelector("#pendingCount");
const completedCount = document.querySelector("#completedCount");


/*
    CREATE TASK ELEMENT
*/

export function createTaskElement(taskText, taskId) {
    // Create the main task item
    const taskItem = document.createElement("li");

    taskItem.classList.add("task-item");

    taskItem.dataset.taskId = taskId;
    taskItem.dataset.state = "pending";


    // Create task text
    const taskTextSpan = document.createElement("span");

    taskTextSpan.classList.add("task-text");

    taskTextSpan.textContent = taskText;


    // Create Complete button
    const completeButton = document.createElement("button");

    completeButton.classList.add("complete-btn");
    completeButton.type = "button";
    completeButton.textContent = "Complete";


    // Create Edit button
    const editButton = document.createElement("button");

    editButton.classList.add("edit-btn");
    editButton.type = "button";
    editButton.textContent = "Edit";


    // Create Remove button
    const removeButton = document.createElement("button");

    removeButton.classList.add("remove-btn");
    removeButton.type = "button";
    removeButton.textContent = "Remove";


    // Add elements to the task item
    taskItem.appendChild(taskTextSpan);
    taskItem.appendChild(completeButton);
    taskItem.appendChild(editButton);
    taskItem.appendChild(removeButton);


    // Return only.
    // This function does NOT append to #taskList.
    return taskItem;
}


/*
    ADD TASK
*/

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


/*
    TOGGLE TASK COMPLETE
*/

export function toggleTaskComplete(taskItem) {
    taskItem.classList.toggle("completed");


    if (taskItem.classList.contains("completed")) {
        setTaskState(taskItem, "completed");
    } else {
        setTaskState(taskItem, "pending");
    }


    updateTaskCounts();
}


/*
    BEGIN TASK EDIT
*/

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


/*
    SAVE TASK EDIT
*/

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


/*
    REMOVE TASK
*/

export function removeTask(taskItem) {
    taskItem.remove();

    updateTaskCounts();
}


/*
    UPDATE TASK COUNTS
*/

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


/*
    EVENT DELEGATION
*/

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


/*
    LOAD SAMPLE TASKS
*/

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


    // Append the fragment only ONCE
    taskList.appendChild(fragment);

    clearTaskMessage(taskMessage);

    updateTaskCounts();
}


/*
    BUTTON EVENTS
*/

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


/*
    ENTER KEY SUPPORT
*/

taskInput.addEventListener(
    "keydown",
    (event) => {
        if (event.key === "Enter") {
            addTask(taskInput.value);
        }
    }
);


/*
    EXACTLY ONE TASK-LIST CLICK LISTENER
*/

taskList.addEventListener(
    "click",
    handleTaskListClick
);


/*
    INITIAL STATE
*/

updateTaskCounts();