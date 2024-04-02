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
        window.location.href = 'signin.html';
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
