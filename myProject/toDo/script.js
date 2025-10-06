/*
document.addEventListener("DOMContentLoaded", () => {
    renderPendingTask("Build To-Do App (frontend)");
    renderPendingTask("Build To-Do App (backend)");
    renderPendingTask("3");
    renderPendingTask("4");
    renderPendingTask("5");
});
}*/

// Wait until the page is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    // +Add button click event
    document.getElementById("add-task").addEventListener("click", add);
    // Listen for done/expired button actions
    //document.getElementById("list").addEventListener("click", handle);
});

// Function: render a new pending task with buttons
function renderPendingTask(text) {
    // pending section
    const list = document.getElementById("list");
    const li = document.createElement("li");
    li.className = "pending";
    // Create buttons
    const doneButton = document.createElement("button");
    doneButton.textContent = "✅";
    doneButton.className = "done-button";
    const expiredButton = document.createElement("button");
    expiredButton.textContent = "❌";
    expiredButton.className = "expired-button";
    // Create text span
    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = text;
    // Add button click events
    doneButton.addEventListener("click", handleDone);
    expiredButton.addEventListener("click", handleExpired);
    // Append all elements
    li.appendChild(expiredButton);
    li.appendChild(doneButton);
    li.appendChild(span);
    // Add to "Pending" section
    list.appendChild(li);
}

// Function: triggered when "+Add" button is clicked
function add() {
    const input = document.getElementById("todo-input");
    const text = input.value.trim();
    // ignore empty input
    if (!text) return;
    renderPendingTask(text);
    // clear input field
    input.value = "";
}

// Function: handle ✅ button click (move to Done)
function handleDone(event) {
    console.log("done clicked");
    const li = event.target.closest("li");
    // change class for color
    li.className = "done";
    // remove buttons
    li.querySelectorAll("button").forEach(button => button.remove());
    // move to done section
    document.getElementById("done-list").appendChild(li);
}

// Function: handle ❌ button click (move to Expired)
function handleExpired(event) {
    console.log("expired clicked");
    const li = event.target.closest("li");
    // change class for color
    li.className = "expired";
    // remove buttons
    li.querySelectorAll("button").forEach(button => button.remove());
    // move to expired section
    document.getElementById("expired-list").appendChild(li);
}



// Function: handle ✅ / ❌ button clicks
/*
function handle(event) {
    console.log(String(event.target));
    const target = event.target; // get clicked element
    // if ✅ button clicked
    if (target.classList.contains("done-button")) {
        // find parent <li>
        const task = target.closest("li");
        // change class
        task.className = "done";
        //document.querySelector(".done .todo-list, .done-list");
        // remove buttons
        task.querySelector(".actions").remove();
        // move to "done" section
        document.querySelector("section:nth-of-type(3) ul").appendChild(task);
    }
    // if ❌ button clicked
    if (target.classList.contains("expired-button")) {
        // find parent <li>
        const task = target.closest("li");
        // change class
        task.className = "expired";
        // remove buttons
        task.querySelector(".actions").remove();
        // move to "expired" section
        document.querySelector("section:nth-of-type(2) ul").appendChild(task);
    }
}
*/