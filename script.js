let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

document
  .getElementById("todo-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    addTask();
  });

function addTask() {
  const taskInput = document.getElementById("task-input").value;
  const dueDate = document.getElementById("due-date").value;
  const category = document.getElementById("category").value;

  const task = {
    id: Date.now(),
    text: taskInput,
    dueDate: dueDate,
    category: category,
    completed: false,
  };

  tasks.push(task);
  saveTasks();
  renderTasks();
  document.getElementById("todo-form").reset();
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks(filter = "all") {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  filteredTasks.forEach((task) => {
    const taskItem = document.createElement("li");
    taskItem.classList.add(
      "task-item",
      "list-group-item",
      "d-flex",
      "justify-content-between"
    );
    if (task.completed) taskItem.classList.add("completed");

    taskItem.innerHTML = `
            <span>${task.text} (Due: ${task.dueDate}, Category: ${
      task.category
    })</span>
            <div>
                <button class="btn btn-outline-info btn-sm" onclick="editTask(${
                  task.id
                })"><i class="fas fa-edit"></i></button>
                <button class="btn btn-outline-danger btn-sm" onclick="deleteTask(${
                  task.id
                })"><i class="fas fa-trash"></i></button>
                <button class="btn btn-outline-success btn-sm" onclick="toggleComplete(${
                  task.id
                })">
                    ${
                      task.completed
                        ? '<i class="fas fa-undo"></i>'
                        : '<i class="fas fa-check"></i>'
                    }
                </button>
            </div>
        `;
    taskList.appendChild(taskItem);
  });
}

function editTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    document.getElementById("task-input").value = task.text;
    document.getElementById("due-date").value = task.dueDate;
    document.getElementById("category").value = task.category;
    deleteTask(id); // Remove it first to avoid duplicate entries
  }
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks();
}

function toggleComplete(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  }
}

function filterTasks(filter) {
  renderTasks(filter);
}

// Initial render
renderTasks();
