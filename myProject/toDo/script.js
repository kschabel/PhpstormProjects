// Task arrays
let pendingTasks = [];
let expiredTasks = [];
let doneTasks = [];

// Wait until the page is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("add-task").addEventListener("click", add);
    renderAll(); // render empty lists at start
});

// Function: render all task lists
function renderAll() {
    renderPendingTasks();
    renderExpiredTasks();
    renderDoneTasks();
}

// Function: render all pending tasks
function renderPendingTasks() {
    const list = document.getElementById("list");
    // clear list first 
    list.replaceChildren();
    pendingTasks.forEach((text, index) => {
        const li = document.createElement("li");
        li.className = "pending";
        // Create action buttons
        const doneButton = document.createElement("button");
        doneButton.textContent = "✅";
        doneButton.className = "done-button";
        doneButton.addEventListener("click", () => handleDone(index));
        const expiredButton = document.createElement("button");
        expiredButton.textContent = "❌";
        expiredButton.className = "expired-button";
        expiredButton.addEventListener("click", () => handleExpired(index));
        // Task text
        const span = document.createElement("span");
        span.className = "task-text";
        span.textContent = text;
        // Add elements together
        li.appendChild(doneButton);
        li.appendChild(expiredButton);
        li.appendChild(span);
        list.appendChild(li);
    });
}

// Function: render all expired tasks
function renderExpiredTasks() {
    const list = document.getElementById("expired-list");
    list.replaceChildren();
    expiredTasks.forEach((text) => {
        const li = document.createElement("li");
        li.className = "expired";
        li.textContent = text;
        list.appendChild(li);
    });
}

// Function: render all done tasks
function renderDoneTasks() {
    const list = document.getElementById("done-list");
    list.replaceChildren();
    doneTasks.forEach((text) => {
        const li = document.createElement("li");
        li.className = "done";
        li.textContent = text;
        list.appendChild(li);
    });
}

// Function: when +Add button clicked
function add() {
    const input = document.getElementById("todo-input");
    const text = input.value.trim();
    // ignore empty input
    if (!text) return;
    // add to pending
    pendingTasks.push(text);
    // clear input
    input.value = "";
    // re-render all lists
    renderAll();
}

// Function: handle ✅ button
function handleDone(index) {
    // move task to done
    doneTasks.push(pendingTasks[index]);
    // remove from pending
    pendingTasks.splice(index, 1);
    // re-render
    renderAll();
}

// Function: handle ❌ button
function handleExpired(index) {
    // move to expired
    expiredTasks.push(pendingTasks[index]);
    // remove from pending
    pendingTasks.splice(index, 1);
    // re-render
    renderAll(); // re-render
}
