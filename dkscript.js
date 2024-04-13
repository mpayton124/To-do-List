// For signup form
if (document.getElementById('signupForm')) {
    document.getElementById('signupForm').addEventListener('submit', function (event) {
        event.preventDefault();

        var name = document.getElementById('name').value;
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        var confirmPassword = document.getElementById('confirm-password').value;
        var terms = document.getElementById('terms').checked;

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        if (!terms) {
            alert("You must agree to the terms and conditions.");
            return;
        }

        alert("Sign-up successful! Please sign in.");
        window.location.href = 'login_screen.html';
    });
}

// For signin form
if (document.getElementById('signinForm')) {
    document.getElementById('signinForm').addEventListener('submit', function (event) {
        event.preventDefault();

        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;

        alert("Sign-in successful! Welcome back.");
        // Redirect to a dashboard or home page here
    });
}
const $userName;
function selectProfile(userName) {
    alert(`Profile selected: ${userName}`);
    window.location.href = 'homepage.html';
}

function addProfile() {
    const profileName = prompt("Enter the new profile name:");
    if (profileName) {
        createProfile(profileName);
    }
}

function createProfile(name) {
    const profilesContainer = document.querySelector('.profiles');

    const profileDiv = document.createElement('div');
    profileDiv.classList.add('profile');
    profileDiv.onclick = function () { selectProfile(name); };

    const img = document.createElement('img');
    // Replace 'default_profile.png' with the path to a default profile image
    img.src = 'default_profile.png';
    img.alt = name;

    const p = document.createElement('p');
    p.textContent = name;

    profileDiv.appendChild(img);
    profileDiv.appendChild(p);

    // Insert the new profile before the Add Profile button
    const addProfileButton = document.querySelector('.add-profile');
    profilesContainer.insertBefore(profileDiv, addProfileButton);
}
document.addEventListener('DOMContentLoaded', function () {
    loadProfiles();
});


function addProfile() {
    console.log("Add profile clicked!"); // This should log in the browser console when you click the "Add Profile" button.
    const profileName = prompt("Enter the new profile name:");
    if (profileName) {
        const newProfile = createProfile(profileName);
        saveProfile(profileName, newProfile);
    }
}

function createProfile(name) {
    const profilesContainer = document.querySelector('.profiles');

    const profileDiv = document.createElement('div');
    profileDiv.classList.add('profile');
    profileDiv.addEventListener('click', function () { selectProfile(name); });

    const img = document.createElement('img');
    img.src = 'default_profile.png'; // Use a default image for new profiles
    img.alt = name;

    const p = document.createElement('p');
    p.textContent = name;

    profileDiv.appendChild(img);
    profileDiv.appendChild(p);

    // Insert the new profile before the Add Profile button
    const addProfileButton = document.querySelector('.add-profile');
    profilesContainer.insertBefore(profileDiv, addProfileButton);

    return profileDiv;
}

function saveProfile(name, profileElement) {
    let profiles = JSON.parse(localStorage.getItem('profiles') || '[]');
    profiles.push({ name: name });
    localStorage.setItem('profiles', JSON.stringify(profiles));
}

function loadProfiles() {
    let profiles = JSON.parse(localStorage.getItem('profiles') || '[]');

    profiles.forEach(profile => {
        createProfile(profile.name);
    });
}

function removeProfile(event, userId) {
    event.stopPropagation(); // Prevent the selectProfile function from firing when the remove button is clicked
    const profileElement = document.querySelector(`.profile[onclick="selectProfile('${userId}')"]`);
    if (profileElement) {
        profileElement.remove(); // Remove the profile element from the DOM
    }
}
