// ===========================
// TASK ARRAYS
// ===========================
let pendingTasks = [];
let doneTasks = [];
let expiredTasks = [];

// ===========================
// INITIALIZE PAGE
// ===========================
document.addEventListener("DOMContentLoaded", async () => {
    await loadTaskCounts();

    const addTaskButton = document.getElementById("add-task");
    if (addTaskButton) {
        addTaskButton.addEventListener("click", async () => {
            await addTask();
            await toggleTasks('pending', true); // auto-show pending tasks
        });
    }
});

// ===========================
// LOAD COUNTS ONLY
// ===========================
async function loadTaskCounts() {
    const response = await fetch("/api/hideTasks.php");
    const data = await response.json();

    pendingTasks = data.pending ?? [];
    doneTasks = data.done ?? [];
    expiredTasks = data.expired ?? [];

    document.getElementById("pending-count").textContent = pendingTasks.length;
    document.getElementById("done-count").textContent = doneTasks.length;
    document.getElementById("expired-count").textContent = expiredTasks.length;
}

// ===========================
// TOGGLE CATEGORY LIST
// ===========================
async function toggleTasks(category, forceOpen = false) {
    const listEl = document.getElementById(category + '-list');
    if (!listEl) return;

    const isHidden = listEl.style.display === 'none';
    if (forceOpen || isHidden) {
        listEl.style.display = 'block';
        listEl.replaceChildren(); // clear previous children
        await loadTasksByCategory(category);
    } else {
        listEl.style.display = 'none';
    }
}

// ===========================
// LOAD TASKS PER CATEGORY
// ===========================
async function loadTasksByCategory(category) {
    let tasks;
    if (category === 'pending') tasks = pendingTasks;
    else if (category === 'done') tasks = doneTasks;
    else if (category === 'expired') tasks = expiredTasks;
    else tasks = [];

    const listEl = document.getElementById(category + '-list');
    tasks.forEach(task => {
        const li = document.createElement("li");
        li.dataset.id = task.id;

        const span = document.createElement("span");
        span.textContent = task.text;
        span.className = "task-text";

        // Buttons for pending tasks
        if (category === 'pending') {
            const doneButton = document.createElement("button");
            doneButton.textContent = "✅";
            doneButton.addEventListener("click", () => markDone(task.id));

            const expiredButton = document.createElement("button");
            expiredButton.textContent = "❌";
            expiredButton.addEventListener("click", () => markExpired(task.id));

            li.appendChild(doneButton);
            li.appendChild(expiredButton);
        }

        // Edit button
        const editButton = document.createElement("button");
        editButton.textContent = "✏️";
        editButton.addEventListener("click", () => startEdit(task.id));

        // Move button
        const moveButton = document.createElement("button");
        moveButton.textContent = "🔄";
        moveButton.addEventListener("click", () => showMoveOptions(task.id));

        li.appendChild(editButton);
        li.appendChild(moveButton);
        li.appendChild(span);

        listEl.appendChild(li);
    });
}

// ===========================
// ADD NEW TASK
// ===========================
async function addTask() {
    const input = document.getElementById("todo-input");
    const text = input.value.trim();
    if (!text) return;

    const formData = new FormData();
    formData.append("task", text);
    await fetch("/api/add.php", { method: "POST", body: formData });

    input.value = "";
    await loadTaskCounts();
}

// ===========================
// MARK DONE
// ===========================
async function markDone(id) {
    const formData = new FormData();
    formData.append("id", id);
    await fetch("/api/addDone.php", { method: "POST", body: formData });
    await refreshCategory('pending');
    await refreshCategory('done');
}

// ===========================
// MARK EXPIRED
// ===========================
async function markExpired(id) {
    const formData = new FormData();
    formData.append("id", id);
    await fetch("/api/addExpired.php", { method: "POST", body: formData });
    await refreshCategory('pending');
    await refreshCategory('expired');
}

// ===========================
// REFRESH CATEGORY LIST
// ===========================
async function refreshCategory(category) {
    await loadTaskCounts();
    const listEl = document.getElementById(category + '-list');
    if (!listEl) return;
    if (listEl.style.display === 'block') {
        listEl.replaceChildren();
        await loadTasksByCategory(category);
    }
}

// ===========================
// START EDIT
// ===========================
async function startEdit(id) {
    const li = document.querySelector(`li[data-id="${id}"]`);
    if (!li) return;

    const taskObj = findTaskById(id);
    if (!taskObj) return;

    li.replaceChildren();

    const input = document.createElement("input");
    input.type = "text";
    input.value = taskObj.text;
    input.className = "task-text";
    input.style.minWidth = "200px";

    const saveButton = document.createElement("button");
    saveButton.textContent = "💾";
    saveButton.addEventListener("click", async () => {
        const newText = input.value.trim();
        if (!newText) return;
        await saveEdit(id, newText);
    });

    const cancelButton = document.createElement("button");
    cancelButton.textContent = "❌";
    cancelButton.addEventListener("click", async () => {
        const category = getTaskCategory(id);
        await refreshCategory(category);
    });

    li.appendChild(input);
    li.appendChild(saveButton);
    li.appendChild(cancelButton);

    input.focus();
    input.select();
}

// ===========================
// SAVE EDIT
// ===========================
async function saveEdit(id, newText) {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("text", newText);
    await fetch("/api/edit.php", { method: "POST", body: formData });

    const category = getTaskCategory(id);
    await refreshCategory(category);
}

// ===========================
// MOVE TASK
// ===========================
async function moveTask(id, newStatus) {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("status", newStatus);

    const response = await fetch("/api/move.php", { method: "POST", body: formData });
    const data = await response.json();
    if (!data.success) alert("Move failed: " + data.error);

    const oldCategory = getTaskCategory(id);
    await refreshCategory(oldCategory);
    await refreshCategory(newStatus);
}

// ===========================
// SHOW MOVE OPTIONS
// ===========================
function showMoveOptions(id) {
    const li = document.querySelector(`li[data-id="${id}"]`);
    if (!li) return;

    li.replaceChildren();

    const select = document.createElement("select");
    ["pending","done","expired"].forEach(status => {
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
        const category = getTaskCategory(id);
        await refreshCategory(category);
    });

    li.appendChild(select);
    li.appendChild(saveButton);
    li.appendChild(cancelButton);
}

// ===========================
// HELPER FUNCTIONS
// ===========================
function getTaskCategory(id) {
    if (pendingTasks.find(t => t.id == id)) return 'pending';
    if (doneTasks.find(t => t.id == id)) return 'done';
    if (expiredTasks.find(t => t.id == id)) return 'expired';
    return null;
}

function findTaskById(id) {
    return pendingTasks.concat(doneTasks, expiredTasks).find(t => t.id == id) || null;
}
