const listsContainer = document.querySelector('[data-lists]')
const newListForm = document.querySelector('[data-new-list-form]')
const newListInput = document.querySelector('[data-new-list-input]')
const deleteListButton = document.querySelector('[data-delete-list-button]')
const listDisplayContainer = document.querySelector('[data-list-display-container]')
const listTitleElement = document.querySelector('[data-list-title]')
const listCountElement = document.querySelector('[data-list-count]')
const tasksContainer = document.querySelector('[data-tasks]')
const taskTemplate = document.getElementById('task-template')
const newTaskForm = document.querySelector('[data-new-task-form]')
const newTaskInput = document.querySelector('[data-new-task-input]')
const clearCompleteTasksButton = document.querySelector('[data-clear-complete-tasks-button]')
const shareButton = document.getElementById('share-button');
const timeButton = document.getElementById('timepicker');

const LOCAL_STORAGE_LIST_KEY = 'task.lists'
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId'
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)
let profiles = JSON.parse(localStorage.getItem('profiles')) || [];
let selectedProfile = localStorage.getItem("selectedProfile");
let selectedProfileId = returnSelectedProfileId();

console.log(selectedListId);
console.log(localStorage);
console.log(selectedProfile);
console.log(selectedProfileId);

listsContainer.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'li') {
	selectedProfile = profiles.find(profile => profile.id === selectedProfileId);
    selectedList = selectedProfile.lists.find(list => list.id === selectedListId)
    selectedListId = e.target.dataset.listId;
	console.log(selectedListId);
	console.log(selectedList);
    saveAndRender();
	//displayListTitle(selectedListId);	
  }
});

tasksContainer.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'input') {
    const selectedProfile = profiles.find(profile => profile.id === selectedProfileId);
    const selectedList = selectedProfile.lists.find(list => list.id === selectedListId)
	console.log(selectedList);
    const selectedTask = selectedList.tasks.find(task => task.id === e.target.id)
    selectedTask.complete = e.target.checked
    save()
	//renderTasks(selectedList)
    renderTaskCount(selectedList)
  }
})

clearCompleteTasksButton.addEventListener('click', e => {
  const selectedProfile = profiles.find(profile => profile.id === selectedProfileId);
  const selectedList = selectedProfile.lists.find(list => list.id === selectedListId)
  console.log(selectedList);
  console.log(selectedListId);
  selectedList.tasks = selectedList.tasks.filter(task => !task.complete)
  saveAndRender()
})

deleteListButton.addEventListener('click', e => {
  const selectedProfile = profiles.find(profile => profile.id === selectedProfileId);
  selectedProfile.lists = selectedProfile.lists.filter(list => list.id !== selectedListId);
  selectedListId = null;
  saveAndRender();
});

function mail() {
  const email = prompt("Please enter the email you wish to share this list to: ");
  window.open('mailto:' + email + '?subject=Invitation to List&body=You are wanted to collaborate on a list Login here: [link]');
}

newListForm.addEventListener('submit', e => {
  e.preventDefault();
  const listName = newListInput.value.trim();
  if (listName == null || listName === '') { return }
  const list = createList(listName);
  newListInput.value = null;
  const selectedProfile = profiles.find(profile => profile.id === selectedProfileId);
  selectedProfile.lists.push(list);
  selectedListId = list.id;
  console.log(localStorage);
  console.log(selectedListId);
  saveAndRender();
});

newTaskForm.addEventListener('submit', e => {
  e.preventDefault();
  const taskName = newTaskInput.value.trim();
  const time = timeButton.value;
  if (taskName == null || taskName === '' || time == null) {return }
  const task = createTask(taskName, time);
  newTaskInput.value = '';
  timeButton.value = null;
  const selectedProfile = profiles.find(profile => profile.id === selectedProfileId);
  const selectedList = selectedProfile.lists.find(list => list.id === selectedListId);
  selectedList.tasks.push(task);
  saveAndRender();
  renderTasks(selectedList);
  renderTaskCount(selectedList);
});

function createList(name) {
  return { id: Date.now().toString(), name: name, tasks: [] }
}

function createTask(name, time) {
  return { id: Date.now().toString(), name: name, time: time, complete: false }
}

function clearDisplay() {
	clearElement(listsContainer)
	clearElement(tasksContainer)
}

function saveAndRender() {
  save()
  render()
}


function save() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
  localStorage.setItem('profiles', JSON.stringify(profiles));
}

function render() {
  const selectedProfile = profiles.find(profile => profile.id === selectedProfileId);
  clearElement(listsContainer)
  renderLists(selectedProfile)
  displayUpcomingTasks(selectedProfile);
  let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY) 
  const selectedList = selectedProfile.lists.find(list => list.id === selectedListId)
  console.log(selectedList);
  console.log(selectedListId);
  if (selectedListId === null) {
    listDisplayContainer.style.display = 'none'
  } else {
    listDisplayContainer.style.display = ''
	if (selectedList) {
		listTitleElement.innerText = selectedList.name
	}
    clearElement(tasksContainer)
    renderTasks(selectedList)
	renderTaskCount(selectedList)
  }
}

function renderTasks(selectedList) {
	console.log(selectedList);
	if (selectedList) {
		clearElement(tasksContainer);
  selectedList.tasks.forEach(task => {
    const taskElement = document.importNode(taskTemplate.content, true)
    const checkbox = taskElement.querySelector('input')
    checkbox.id = task.id
    checkbox.checked = task.complete
    const label = taskElement.querySelector('label')
	const formattedtime = formatTime(task.time);
	console.log(task.time);
	console.log(formattedtime);
    label.htmlFor = task.id
    label.append(task.name + '   ')
	if (task.time != '') {
	  label.append('(' + formattedtime + ')');
	}
    tasksContainer.appendChild(taskElement)
  })
	}
}

function renderLists(selectedProfile) {
  selectedProfile.lists.forEach(list => {
    const listElement = document.createElement('li')
    listElement.dataset.listId = list.id
    listElement.classList.add("list-name")
    listElement.innerText = list.name
    if (list.id === selectedListId) {
      listElement.classList.add('active-list')
    }
    listsContainer.appendChild(listElement)
  })
}

function renderTaskCount(selectedList) {
	if (selectedList) {
  const incompleteTaskCount = selectedList.tasks.filter(task => !task.complete).length;
  const taskString = incompleteTaskCount === 1 ? "task" : "tasks";
  listCountElement.innerText = `${incompleteTaskCount} ${taskString} remaining`;
}
console.log(selectedList);
}

function displayUpcomingTasks(selectedProfile) {
	const upcomingTasks = document.getElementById('upcoming');
	const urgent = renderUpcomingTasks(selectedProfile);
	console.log(urgent);
	upcomingTasks.innerHTML = '';
	urgent.forEach(task => {
		console.log(task);
		const taskElement = document.createElement('div');
        taskElement.textContent = `${task.name} - Due: ${formatTime(task.time)}`;
        upcomingTasks.appendChild(taskElement);
	});
}

function renderUpcomingTasks (selectedProfile) {
	const time = new Date();
	console.log(time);
	const tomorrow = new Date(time.getTime() + 24 * 60 * 60 * 1000);
	console.log(tomorrow);
	const upcoming = [];
	selectedProfile.lists.forEach(list => {
		list.tasks.forEach(task => {
			console.log(task.time);
			console.log(new Date(task.time));
			if ((task.time != '') && (new Date (task.time) <= tomorrow)) {
				upcoming.push(task);
			}
		});
	});
	
	console.log(upcoming);
	
	return upcoming;
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild)
  }
}

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
  save();
  alert(`List shared with ${receiverProfile.name}`);
  render();
}

function returnSelectedProfileId() {
	const profiles = JSON.parse(localStorage.getItem('profiles')) || [];
	const selectedProfileName = localStorage.getItem('selectedProfile');
	const selectedProfile = profiles.find(profile => profile.name === selectedProfileName);
	return selectedProfile.id;
}

function formatTime(timeString) {
    const date = new Date(timeString);
    const options = { /*weekday: 'long',*/ year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

document.addEventListener('DOMContentLoaded', function () {
  render();
});
