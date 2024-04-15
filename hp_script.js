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
const switchProfileButton = document.querySelector('[data-switch-profile-button]');
const logoutButton = document.querySelector('[data-logout-button]');
const shareButton = document.querySelector('[data-share-button]');

const LOCAL_STORAGE_LIST_KEY = 'task.lists';
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId';
const LOCAL_STORAGE_PROFILES_KEY = 'task.profiles';
let profiles = loadProfiles();
let selectedProfileId = null;

function saveProfiles(profiles) {
  localStorage.setItem(LOCAL_STORAGE_PROFILES_KEY, JSON.stringify(profiles));
}

function loadProfiles() {
  return JSON.parse(localStorage.getItem(LOCAL_STORAGE_PROFILES_KEY)) || [];
}


function switchProfile(profileId) {
  selectedProfileId = profileId;
  selectedListId = null;
  saveAndRender();
}
// Function to switch profile and redirect to profile page
function switchProfile() {
  // Redirect to the profile's page URL
  window.location.href = 'profilepage.html'; // Replace 'profilepage.html' with the actual URL of your profile page
}

document.querySelector('.dropdown-content a:nth-child(2)').addEventListener('click', () => {
  localStorage.clear();
  window.location.href = 'login_screen.html';
});

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
    saveProfiles(profiles);
    renderTaskCount(selectedList);
  }
});

clearCompleteTasksButton.addEventListener('click', e => {
  const selectedProfile = profiles.find(profile => profile.id === selectedProfileId);
  const selectedList = selectedProfile.lists.find(list => list.id === selectedListId);
  selectedList.tasks = selectedList.tasks.filter(task => !task.complete);
  saveProfiles(profiles);
  saveAndRender();
});

deleteListButton.addEventListener('click', e => {
  const selectedProfile = profiles.find(profile => profile.id === selectedProfileId);
  selectedProfile.lists = selectedProfile.lists.filter(list => list.id !== selectedListId);
  selectedListId = null;
  saveProfiles(profiles);
  saveAndRender();
});

shareButton.addEventListener('click', e => {
  // Implement share functionality here
  // You can use profiles and selectedProfileId to access and modify data
});

newListForm.addEventListener('submit', e => {
  e.preventDefault();
  const listName = newListInput.value.trim();
  if (listName === '') return;
  const list = createList(listName, selectedProfileId);
  newListInput.value = '';
  const selectedProfile = profiles.find(profile => profile.id === selectedProfileId);
  if (selectedProfile) {
    selectedProfile.lists.push(list);
    saveProfiles(profiles);
    saveAndRender();
  } else {
    console.log('No profile selected or found.');
  }
});



newTaskForm.addEventListener('submit', e => {
  e.preventDefault();
  const taskName = newTaskInput.value.trim();
  if (taskName === '') return;
  const selectedProfile = profiles.find(profile => profile.id === selectedProfileId);
  const selectedList = selectedProfile.lists.find(list => list.id === selectedListId);
  const task = createTask(taskName);
  selectedList.tasks.push(task);
  newTaskInput.value = '';
  saveProfiles(profiles);
  saveAndRender();
});

function createList(name, profileId) {
  return { id: Date.now().toString(), name: name, profileId: profileId, tasks: [] };
}

function createTask(name) {
  return { id: Date.now().toString(), name: name, complete: false };
}

function saveAndRender() {
  saveProfiles(profiles);
  render();
}

function save() {
  localStorage.setItem(LOCAL_STORAGE_PROFILES_KEY, JSON.stringify(profiles));
}

function render() {
  clearElement(listsContainer);
  const selectedProfile = profiles.find(profile => profile.id === selectedProfileId);
  if (!selectedProfile) {
    listDisplayContainer.style.display = 'none';
    console.log('No selected profile found.');
  } else {
    listDisplayContainer.style.display = '';
    const listElements = document.createElement('ul'); // Create a UL element to hold the list items
    selectedProfile.lists.forEach(list => {
      const listElement = document.createElement('li');
      listElement.textContent = list.name;
      listElement.dataset.listId = list.id;
      listElement.classList.add('list-name');
      if (list.id === selectedListId) {
        listElement.classList.add('active-list');
      }
      listElement.addEventListener('click', () => {
        selectedListId = list.id;
        saveAndRender();
      });
      listElements.appendChild(listElement);
    });

    listsContainer.appendChild(listElements);
    renderTasks(selectedProfile.lists.find(l => l.id === selectedListId));
  }
}



function renderTasks(selectedList) {
  if (!selectedList) return;
  tasksContainer.innerHTML = ''; // Clear the tasks container before rendering

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


function renderTaskCount(selectedList) {
  if (!selectedList) return;
  const incompleteTaskCount = selectedList.tasks.filter(task => !task.complete).length;
  const taskString = incompleteTaskCount === 1 ? "task" : "tasks";
  listCountElement.innerText = `${incompleteTaskCount} ${taskString} remaining`;
}

function renderLists() {
  profiles.forEach(profile => {
    const profileElement = document.createElement('li');
    profileElement.dataset.profileId = profile.id;
    profileElement.classList.add("profile-name");
    profileElement.innerText = profile.name;
    if (profile.id === selectedProfileId) {
      profileElement.classList.add('active-profile');
    }
    listsContainer.appendChild(profileElement);
  });
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  selectedProfileId = localStorage.getItem(LOCAL_STORAGE_SELECTED_PROFILE_ID_KEY);
  // Make sure that you set LOCAL_STORAGE_SELECTED_PROFILE_ID_KEY somewhere when a profile is selected
  if (selectedProfileId) {
    render();  // Only call render if there is a profile selected to avoid errors
  } else {
    // Possibly handle the case where no profile is selected yet
    console.log('No profile selected');
  }
});
