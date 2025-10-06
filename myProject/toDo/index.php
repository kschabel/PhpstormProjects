<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My To-Do List</title>
    <link rel="stylesheet" href="styles.css">
    <script src="script.js"></script>
</head>
<body>
<main class="todo-app">
    <h1>📝 My To-Do List</h1>

    <!-- Input + Add Button -->
    <div id="todo-btn" class="todo-add">
        <input id="todo-input" type="text" placeholder="Add a new task...">
        <button id="add-task">+Add</button>
    </div>

    <br>

    <!-- Pending section -->
    <section>
        <h2>Pending tasks:</h2>
        <ul id="list" class="todo-list">
            <!-- Tasks will be added here -->
        </ul>
    </section>

    <br>

    <!-- Expired section -->
    <section>
        <h2>Expired tasks:</h2>
        <ul id="expired-list" class="todo-list"></ul>
    </section>

    <br>

    <!-- Done section -->
    <section>
        <h2>Done tasks:</h2>
        <ul id="done-list" class="todo-list"></ul>
    </section>

    <br>
    <hr>

    <!-- Legend -->
    <section class="legend">
        <h3><u>Legend:</u></h3>
        <p><span class="pending">Pending</span> = Task still open (choose ✅ or ❌)</p>
        <p><span class="done">Done</span> = Task completed</p>
        <p><span class="expired">Expired</span> = Task failed or canceled</p>
        <p>✅ = mark as <span class="done">done</span></p>
        <p>❌ = mark as <span class="expired">expired</span></p>
    </section>
</main>
</body>
</html>
