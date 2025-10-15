// Task arrays
let pendingTasks = [];
let doneTasks = [];
let expiredTasks = [];

// Wait until page is loaded
document.addEventListener("DOMContentLoaded", async () => {
    await loadTasks();

    document.getElementById("add-task").addEventListener("click", async () => {
        await add();
        await loadTasks();
    });
});

// Load tasks from backend
async function loadTasks() {
    const response= await fetch("/api/get.php");
    const data = await response.json();

    pendingTasks = data.pending ?? [];
    doneTasks = data.done ?? [];
    expiredTasks = data.expired ?? [];

    renderAll();
}

// Render everything
function renderAll() {
    renderPendingTasks();
    renderDoneTasks();
    renderExpiredTasks();
}

// Render pending tasks + edit button
function renderPendingTasks() {
    const list = document.getElementById("list");
    list.replaceChildren();

    pendingTasks.forEach(task => {
        const li = document.createElement("li");
        li.className = "pending";
        li.dataset.id = task.id; // store id in DOM

        // Done button
        const doneButton = document.createElement("button");
        doneButton.textContent = "✅";
        doneButton.addEventListener("click", () => markDone(task.id));

        // Expired button
        const expiredButton = document.createElement("button");
        expiredButton.textContent = "❌";
        expiredButton.addEventListener("click", () => markExpired(task.id));

        // Edit button
        const editButton = document.createElement("button");
        editButton.textContent = "✏️";
        editButton.addEventListener("click", () => startEdit(task.id));

        // Move Task
        const moveButton = document.createElement("button");
        moveButton.textContent = "🔄";
        moveButton.addEventListener("click", () => showMoveOptions(task.id));

        // Task text
        const span = document.createElement("span");
        span.textContent = task.text;
        span.className = "task-text";

        li.appendChild(doneButton);
        li.appendChild(expiredButton);
        li.appendChild(editButton);
        li.appendChild(span);
        list.appendChild(li);
    });
}

// Render done tasks + edit button
function renderDoneTasks() {
    const list = document.getElementById("done-list");
    list.replaceChildren();

    doneTasks.forEach(task => {
        const li = document.createElement("li");
        li.className = "done";
        li.dataset.id = task.id;

        // Edit button for done tasks
        const editButton = document.createElement("button");
        editButton.textContent = "✏️";
        editButton.addEventListener("click", () => startEdit(task.id));

        // Move Task
        const moveButton = document.createElement("button");
        moveButton.textContent = "🔄";
        moveButton.addEventListener("click", () => showMoveOptions(task.id));

        const span = document.createElement("span");
        span.textContent = task.text;
        span.className = "task-text";

        li.appendChild(editButton);
        li.appendChild(moveButton);
        li.appendChild(span);
        list.appendChild(li);
    });
}

// Render expired tasks + edit button
function renderExpiredTasks() {
    const list = document.getElementById("expired-list");
    list.replaceChildren();

    expiredTasks.forEach(task => {
        const li = document.createElement("li");
        li.className = "expired";
        li.dataset.id = task.id;

        // Edit button for expired tasks
        const editButton = document.createElement("button");
        editButton.textContent = "✏️";
        editButton.addEventListener("click", () => startEdit(task.id));

        // Move Task
        const moveButton = document.createElement("button");
        moveButton.textContent = "🔄";
        moveButton.addEventListener("click", () => showMoveOptions(task.id));

        const span = document.createElement("span");
        span.textContent = task.text;
        span.className = "task-text";

        li.appendChild(editButton);
        li.appendChild(moveButton);
        li.appendChild(span);
        list.appendChild(li);
    });
}

// Add new task
async function add() {
    const input = document.getElementById("todo-input");
    const text = input.value.trim();
    if (!text) return;

    const formData = new FormData();
    formData.append("task", text);

    await fetch("/api/add.php", { method: "POST", body: formData });

    input.value = "";
}

// Mark done
async function markDone(id) {
    const formData = new FormData();
    formData.append("id", id);
    const response = await fetch("/api/addDone.php", { method: "POST", body: formData });
    const data = await response.json();
    console.log(data.success);
    if (!data.success) {
        alert("Something went wrong!");
    }
    await loadTasks();
}

// Mark expired
async function markExpired(id) {
    const formData = new FormData();
    formData.append("id", id);
    const response = await fetch("/api/addExpired.php", { method: "POST", body: formData });
    const data = await response.json();
    console.log(data.success);
    await loadTasks();
}

// Delete task
async function deleteTask(id) {
    const formData = new FormData();
    formData.append("id", id);
    await fetch("/api/delete.php", { method: "POST", body: formData });
    await loadTasks();
}

// Edit task (start)
async function startEdit(id) {
    // Find the list item DOM element for this id (all lists)
    const li = document.querySelector(`li[data-id="${id}"]`);
    if (!li) return;

    // Find the current task text from arrays
    const taskObj = findTaskById(id);
    if (!taskObj) return;

    // Clear list item content
    li.replaceChildren();

    // Create input pre-filled with current text
    const input = document.createElement("input");
    input.type = "text";
    input.value = taskObj.text;
    input.className = "task-text";
    input.style.minWidth = "200px";

    // Save button
    const saveButton = document.createElement("button");
    saveButton.textContent = "💾";
    saveButton.addEventListener("click", async () => {
        const newText = input.value.trim();
        if (!newText) return; // do not save empty
        await saveEdit(id, newText);
    });

    // Cancel button
    const cancelButton = document.createElement("button");
    cancelButton.textContent = "❌";
    cancelButton.addEventListener("click", async () => {
        await loadTasks(); // reload original lists
    });

    // Append input + buttons to li
    li.appendChild(input);
    li.appendChild(saveButton);
    li.appendChild(cancelButton);

    // Focus input and select text for quick editing
    input.focus();
    input.select();
}

// Find task by id
function findTaskById(id) {
    id = Number(id);
    for (const t of pendingTasks) if (Number(t.id) === id) return t;
    for (const t of doneTasks) if (Number(t.id) === id) return t;
    for (const t of expiredTasks) if (Number(t.id) === id) return t;
    return null;
}

// Edit save
async function saveEdit(id, newText) {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("text", newText);

    const response= await fetch("/api/edit.php", { method: "POST", body: formData });
    const data = await response.json();
    console.log(data.success);

    // If backend returns success, reload lists
    if (data.success) {
        await loadTasks();
    } else {
        // If error returned, show simple alert and reload to restore UI
        alert(data.error || "Update failed");
        await loadTasks();
    }
}

// Move task
async function moveTask(id, newStatus) {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("status", newStatus);

    const res = await fetch("/api/move.php", {
        method: "POST",
        body: formData
    });

    const data = await res.json();
    if (data.success) {
        await loadTasks();
    } else {
        alert("Move failed: " + data.error);
    }
}


// Show move options
function showMoveOptions(id) {
    const li = document.querySelector(`li[data-id="${id}"]`);
    if (!li) return;

    li.replaceChildren();

    const select = document.createElement("select");
    ["pending", "done", "expired"].forEach(status => {
        const option = document.createElement("option");
        option.value = status;
        option.textContent = status;
        select.appendChild(option);
    });

    const saveButton = document.createElement("button");
    saveButton.textContent = "💾";
    saveButton.addEventListener("click", async () => {
        await moveTask(id, select.value);
    });

    const cancelButton = document.createElement("button");
    cancelButton.textContent = "❌";
    cancelButton.addEventListener("click", async () => {
        await loadTasks();
    });

    li.appendChild(select);
    li.appendChild(saveButton);
    li.appendChild(cancelButton);
}
