// Function to handle signup form submission
if (document.getElementById('signupForm')) {
    document.getElementById('signupForm').addEventListener('submit', function (event) {
        event.preventDefault();

        // Validation and signup logic here...

        alert("Sign-up successful! Please sign in.");
        window.location.href = 'signin.html'; // Redirect to the sign-in page
    });
}

// Function to handle signin form submission
if (document.getElementById('signinForm')) {
    document.getElementById('signinForm').addEventListener('submit', function (event) {
        event.preventDefault();

        // Sign-in logic here...

        alert("Sign-in successful! Welcome back.");
        window.location.href = 'profile.html'; // Redirect to the profile selection page
    });
}

// Function to create a new profile
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

// Function to save a profile to local storage
function saveProfile(name) {
    let profiles = JSON.parse(localStorage.getItem('profiles') || '[]');
    profiles.push({ name: name });
    localStorage.setItem('profiles', JSON.stringify(profiles));
}

// Function to load profiles from local storage and display them
function loadProfiles() {
    let profiles = JSON.parse(localStorage.getItem('profiles') || '[]');

    profiles.forEach(profile => {
        createProfile(profile.name);
    });
}

// Event listener when the page content is loaded
document.addEventListener('DOMContentLoaded', function () {
    loadProfiles(); // Load profiles when the page is loaded
});

// Function to handle profile selection
function selectProfile(userName) {
    alert(`Profile selected: ${userName}`);
    window.location.href = 'homepage.html'; // Redirect to the homepage 
}

// Function to handle adding a new profile
function addProfile() {
    const profileName = prompt("Enter the new profile name:");
    if (profileName) {
        createProfile(profileName); // Create the profile dynamically
        saveProfile(profileName); // Save the profile to local storage
    }
}
