document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('taskInput');
  const addButton = document.getElementById('addButton');
  const taskList = document.getElementById('taskList');

  function renderTasks(tasks) {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span>${task.text}</span>
        <button class="remove" data-index="${index}">Remove</button>
      `;
      taskList.appendChild(li);
    });
  }

  function loadTasks() {
    chrome.storage.local.get(['tasks'], (result) => {
      const tasks = result.tasks || [];
      renderTasks(tasks);
    });
  }

  function saveTask(task) {
    chrome.storage.local.get(['tasks'], (result) => {
      const tasks = result.tasks || [];
      tasks.push(task);
      chrome.storage.local.set({ tasks }, () => {
        loadTasks();
      });
    });
  }

  function removeTask(index) {
    chrome.storage.local.get(['tasks'], (result) => {
      const tasks = result.tasks || [];
      tasks.splice(index, 1);
      chrome.storage.local.set({ tasks }, () => {
        loadTasks();
      });
    });
  }

  addButton.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    if (taskText) {
      saveTask({ text: taskText });
      taskInput.value = '';
    }
  });

  taskList.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove')) {
      const index = event.target.getAttribute('data-index');
      removeTask(index);
    }
  });

  loadTasks();
});
