// Function to handle signup form submission
document.getElementById('signupForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Get form input values
    var username = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirm-password').value;
    var termsChecked = document.getElementById('terms').checked;

    // Validate password match
    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    // Validate terms agreement
    if (!termsChecked) {
        alert("You must agree to the terms and conditions.");
        return;
    }

    // Create user object
    var user = {
        username: username,
        email: email,
        password: password
    };

    // Save user data to local storage
    localStorage.setItem('user', JSON.stringify(user));

    alert("Sign-up successful! Please sign in.");
    window.location.href = 'login_screen.html'; // Redirect to login page
});
