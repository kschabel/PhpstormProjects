let pendingTasks = [];
let doneTasks = [];
let expiredTasks = [];

document.addEventListener("DOMContentLoaded", async () => {
    await loadTasks();

    document.getElementById("add-task").addEventListener("click", async () => {
        await add();
        await loadTasks();
    });
});

async function loadTasks() {
    const res = await fetch("/api/get.php");
    const data = await res.json();

    pendingTasks = data.pending;
    doneTasks = data.done ?? [];
    expiredTasks = data.expired ?? [];

    renderAll();
}

function renderAll() {
    renderPendingTasks();
    renderDoneTasks();
    renderExpiredTasks();
}

function renderPendingTasks() {
    const list = document.getElementById("list");
    list.replaceChildren();

    pendingTasks.forEach(task => {
        const li = document.createElement("li");
        li.className = "pending";

        const doneButton = document.createElement("button");
        doneButton.textContent = "✅";
        doneButton.addEventListener("click", () => markDone(task.id));

        const expiredButton = document.createElement("button");
        expiredButton.textContent = "❌";
        expiredButton.addEventListener("click", () => markExpired(task.id));

        const span = document.createElement("span");
        span.textContent = task.text;

        li.appendChild(doneButton);
        li.appendChild(expiredButton);
        li.appendChild(span);
        list.appendChild(li);
    });
}

function renderDoneTasks() {
    const list = document.getElementById("done-list");
    list.replaceChildren();
    doneTasks.forEach(task => {
        const li = document.createElement("li");
        li.textContent = task.text;
        list.appendChild(li);
    });
}

function renderExpiredTasks() {
    const list = document.getElementById("expired-list");
    list.replaceChildren();
    expiredTasks.forEach(task => {
        const li = document.createElement("li");
        li.textContent = task.text;
        list.appendChild(li);
    });
}

async function add() {
    const input = document.getElementById("todo-input");
    const text = input.value.trim();
    if (!text) return;

    const formData = new FormData();
    formData.append("task", text);

    await fetch("/api/add.php", { method: "POST", body: formData });

    input.value = "";
    await loadTasks();
}

async function markDone(id) {
    const formData = new FormData();
    formData.append("id", id);
    await fetch("/api/addDone.php", { method: "POST", body: formData });
    await loadTasks();
}

async function markExpired(id) {
    const formData = new FormData();
    formData.append("id", id);
    await fetch("/api/addExpired.php", { method: "POST", body: formData });
    await loadTasks();
}

async function deleteTask(id) {
    const formData = new FormData();
    formData.append("id", id);
    await fetch("/api/delete.php", { method: "POST", body: formData });
    await loadTasks();
}
