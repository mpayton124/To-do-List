const listsContainer = document.querySelector('[data-lists]');
const newListForm = document.querySelector('[data-new-list-form]');
const newListInput = document.querySelector('[data-new-list-input]');
const deleteListButton = document.querySelector('[data-delete-list-button]');
const listDisplayContainer = document.querySelector('[data-list-display-container]');
const listTitleElement = document.querySelector('[data-list-title]');
const listCountElement = document.querySelector('[data-list-count]');
const tasksContainer = document.querySelector('[data-tasks]');
const taskTemplate = document.getElementById('task-template');
const newTaskForm = document.querySelector('[data-new-task-form]');
const newTaskInput = document.querySelector('[data-new-task-input]');
const clearCompleteTasksButton = document.querySelector('[data-clear-complete-tasks-button]');
const shareButton = document.querySelector('.share-btn');

const LOCAL_STORAGE_PROFILES_KEY = 'task.profiles';
const LOCAL_STORAGE_SELECTED_PROFILE_ID_KEY = 'task.selectedProfileId';
let profiles = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PROFILES_KEY)) || [];
let selectedProfileId = localStorage.getItem(LOCAL_STORAGE_SELECTED_PROFILE_ID_KEY);

function saveProfiles() {
  localStorage.setItem(LOCAL_STORAGE_PROFILES_KEY, JSON.stringify(profiles));
}

function saveAndRender() {
  saveProfiles();
  render();
}

function createList(name) {
  return { id: Date.now().toString(), name: name, tasks: [], profileId: selectedProfileId };
}

function createTask(name) {
  return { id: Date.now().toString(), name: name, complete: false };
}

function renderLists() {
  listsContainer.innerHTML = '';
  profiles.forEach(profile => {
    if (profile.id === selectedProfileId) {
      profile.lists.forEach(list => {
        const listElement = document.createElement('li');
        listElement.dataset.listId = list.id;
        listElement.classList.add('list-name');
        listElement.innerText = list.name;
        if (list.id === selectedListId) {
          listElement.classList.add('active-list');
        }
        listsContainer.appendChild(listElement);
      });
    }
  });
}

function renderTasks(selectedList) {
  tasksContainer.innerHTML = '';
  selectedList.tasks.forEach(task => {
    const taskElement = document.importNode(taskTemplate.content, true);
    const checkbox = taskElement.querySelector('input');
    checkbox.id = task.id;
    checkbox.checked = task.complete;
    const label = taskElement.querySelector('label');
    label.htmlFor = task.id;
    label.append(task.name);
    tasksContainer.appendChild(taskElement);
  });
}

function render() {
  clearElement(listsContainer);
  renderLists();
  const selectedProfile = profiles.find(profile => profile.id === selectedProfileId);
  if (selectedProfileId == null) {
    listDisplayContainer.style.display = 'none';
  } else {
    listDisplayContainer.style.display = '';
    selectedProfile.lists.forEach(list => {
      if (list.id === selectedListId) {
        listTitleElement.innerText = list.name;
        renderTaskCount(list);
        renderTasks(list);
      }
    });
  }
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

listsContainer.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'li') {
    selectedListId = e.target.dataset.listId;
    saveAndRender();
  }
});

tasksContainer.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'input') {
    const selectedProfile = profiles.find(profile => profile.id === selectedProfileId);
    const selectedList = selectedProfile.lists.find(list => list.id === selectedListId);
    const selectedTask = selectedList.tasks.find(task => task.id === e.target.id);
    selectedTask.complete = e.target.checked;
    saveProfiles();
    renderTaskCount(selectedList);
  }
});

deleteListButton.addEventListener('click', e => {
  const selectedProfile = profiles.find(profile => profile.id === selectedProfileId);
  selectedProfile.lists = selectedProfile.lists.filter(list => list.id !== selectedListId);
  selectedListId = null;
  saveAndRender();
});

newListForm.addEventListener('submit', e => {
  e.preventDefault();
  const listName = newListInput.value.trim();
  if (listName === '') return;
  const list = createList(listName);
  newListInput.value = '';
  const selectedProfile = profiles.find(profile => profile.id === selectedProfileId);
  selectedProfile.lists.push(list);
  saveAndRender();
});

newTaskForm.addEventListener('submit', e => {
  e.preventDefault();
  const taskName = newTaskInput.value.trim();
  if (taskName === '') return;
  const task = createTask(taskName);
  newTaskInput.value = '';
  const selectedProfile = profiles.find(profile => profile.id === selectedProfileId);
  const selectedList = selectedProfile.lists.find(list => list.id === selectedListId);
  selectedList.tasks.push(task);
  saveProfiles();
  renderTaskCount(selectedList);
});

shareButton.addEventListener('click', e => {
  e.preventDefault();
  const selectedProfile = profiles.find(profile => profile.id === selectedProfileId);
  const otherProfiles = profiles.filter(profile => profile.id !== selectedProfileId);
  if (otherProfiles.length === 0) {
    alert('No other profiles to share with.');
    return;
  }
  const sharedList = selectedProfile.lists.find(list => list.id === selectedListId);
  const selectedProfileName = selectedProfile.name;
  const sharePrompt = `Share ${sharedList.name} list with:`;
  let shareOptions = '';
  otherProfiles.forEach(profile => {
    shareOptions += `<button onclick="shareList('${profile.id}', '${sharedList.id}')">${profile.name}</button>`;
  });
  const shareDialog = document.createElement('div');
  shareDialog.innerHTML = `${sharePrompt}<br>${shareOptions}`;
  document.body.appendChild(shareDialog);
});

function shareList(receiverProfileId, sharedListId) {
  const senderProfile = profiles.find(profile => profile.id === selectedProfileId);
  const receiverProfile = profiles.find(profile => profile.id === receiverProfileId);
  const sharedList = senderProfile.lists.find(list => list.id === sharedListId);
  const newSharedList = { ...sharedList, profileId: receiverProfileId };
  receiverProfile.lists.push(newSharedList);
  saveProfiles();
  alert(`List shared with ${receiverProfile.name}`);
  render();
}

function renderTaskCount(selectedList) {
  const incompleteTaskCount = selectedList.tasks.filter(task => !task.complete).length;
  const taskString = incompleteTaskCount === 1 ? "task" : "tasks";
  listCountElement.innerText = `${incompleteTaskCount} ${taskString} remaining`;
}

document.addEventListener('DOMContentLoaded', function () {
  render();
});
