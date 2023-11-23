document.addEventListener("DOMContentLoaded", initialize);

function initialize() {
  loadTasks();
  attachEventListeners();
}

function attachEventListeners() {
  document
    .getElementById("status-filter")
    .addEventListener("change", filterTasks);
  document
    .getElementById("priority-filter")
    .addEventListener("change", filterTasks);
  document
    .getElementById("search-input")
    .addEventListener("input", filterTasksBySearch);
}

function addTask() {
  const taskInput = document.getElementById("task-input");
  const priorityInput = document.getElementById("priority-input");
  const dueDateInput = document.getElementById("due-date-input");

  if (taskInput.value.trim() !== "") {
    const task = {
      title: taskInput.value.trim(),
      completed: false,
      priority: priorityInput.value,
      dueDate: dueDateInput.value,
    };

    saveTask(task);
    displayTask(task);

    taskInput.value = "";
    priorityInput.value = "low";
    dueDateInput.value = "";
  }
}

function saveTask(task) {
  let tasks = getTasks();
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  let tasks = getTasks();
  tasks.forEach(displayTask);
}

function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function displayTask(task) {
  const taskList = document.getElementById("task-list");
  const li = createTaskElement(task);
  taskList.appendChild(li);
}

function createTaskElement(task) {
  const li = document.createElement("li");
  li.innerHTML = `
    <span class="${task.completed ? "completed" : ""}">${
    task.title
  }</span>
    <span class="priority">Priorität: ${task.priority}</span>
    <span class="due-date">Fällig am: ${task.dueDate}</span>
    <div>
        <button onclick="toggleCompleted(this)">✔</button>
        <button onclick="deleteTask(this)">X</button>
        <button onclick="editTask(this)">Bearbeiten</button>
    </div>
`;
  return li;
}

function toggleCompleted(button) {
  const li = button.closest("li");
  const taskTitle = li.querySelector("span").innerText;
  const tasks = getTasks();
  const index = tasks.findIndex((task) => task.title === taskTitle);

  if (index !== -1) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks(tasks);
    filterTasks();
  }
}

function deleteTask(button) {
  const li = button.closest("li");
  const taskTitle = li.querySelector("span").innerText;
  const tasks = getTasks();
  const updatedTasks = tasks.filter((task) => task.title !== taskTitle);
  saveTasks(updatedTasks);
  li.remove();
}

function editTask(button) {
  const li = button.closest("li");
  const taskTitle = li.querySelector("span").innerText;
  const newTitle = prompt("Bearbeiten:", taskTitle);

  if (newTitle !== null) {
    const tasks = getTasks();
    const index = tasks.findIndex((task) => task.title === taskTitle);

    if (index !== -1) {
      tasks[index].title = newTitle;
      saveTasks(tasks);
      filterTasks();
    }
  }
}

function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function clearLocalStorage() {
  localStorage.clear();
}

function sortTasks() {
  const tasks = getTasks();
  const sortedTasks = tasks.sort((a, b) =>
    a.dueDate.localeCompare(b.dueDate)
  );
  displayTasks(sortedTasks);
}

function scheduleNotification(title, reminderTime) {
  // Hier müsste der Code für die tatsächliche Benachrichtigung stehen
  // Dies kann durch Verwendung von Web-Notifications-API oder anderen Mechanismen erfolgen
}

function filterTasks() {
  const statusFilter = document.getElementById("status-filter").value;
  const priorityFilter = document.getElementById("priority-filter").value;

  let filteredTasks = getTasks().filter((task) => {
    if (
      statusFilter === "all" ||
      (statusFilter === "completed" && task.completed) ||
      (statusFilter === "pending" && !task.completed)
    ) {
      if (priorityFilter === "all" || task.priority === priorityFilter) {
        return true;
      }
    }
    return false;
  });

  displayTasks(filteredTasks);
}

function filterTasksBySearch() {
  const searchInput = document
    .getElementById("search-input")
    .value.trim()
    .toLowerCase();

  let filteredTasks = getTasks().filter(
    (task) =>
      task.title.toLowerCase().includes(searchInput) ||
      task.priority?.toLowerCase().includes(searchInput) ||
      task.dueDate.toLowerCase().includes(searchInput)
  );

  displayTasks(filteredTasks);
}

function displayTasks(tasks) {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = ""; // Leere die Liste, um neu zu rendern
  tasks.forEach(displayTask);
}

document
  .getElementById("search-input")
  .addEventListener("input", filterTasksBySearch);