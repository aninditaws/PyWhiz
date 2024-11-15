document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('authModal');
    const signInForm = document.getElementById('signinForm');
    const signUpForm = document.getElementById('signupForm');
    const openModalButton = document.getElementById('openModal');
    const closeModalButton = document.getElementsByClassName('close')[0];
    const showSignup = document.getElementById('showSignup');
    const showSignin = document.getElementById('showSignin');

    // Open modal and default to Sign In form
    openModalButton.addEventListener('click', function () {
        modal.style.display = 'flex';
        signInForm.style.display = 'block';
        signUpForm.style.display = 'none';
    });

    // Close modal on close button click
    closeModalButton.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    // Switch to Sign Up form
    showSignup.addEventListener('click', function (event) {
        event.preventDefault();
        signInForm.style.display = 'none';
        signUpForm.style.display = 'block';
    });

    // Switch back to Sign In form
    showSignin.addEventListener('click', function (event) {
        event.preventDefault();
        signUpForm.style.display = 'none';
        signInForm.style.display = 'block';
    });

    // Close modal when clicking outside of it
    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Handle Sign In form submission
// Handle Sign In form submission
    document.getElementById('signin-form').addEventListener('submit', async function(event) {
        event.preventDefault();
        const email = document.getElementById('signin-email').value;
        const password = document.getElementById('signin-password').value;

        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (response.ok) {
                // Store token in localStorage
                localStorage.setItem("token", data.token);
                alert("Login successful!");
                window.location.href = "frontend/home.html"; // Redirect to the home page
            } else {
                alert(data.message || "Login failed.");
            }
        } catch (error) {
            console.error("Error during sign in:", error);
            alert("An error occurred during login. Please try again.");
        }
    });


    // Handle Sign Up form submission
// Sign Up Submission
    document.getElementById('signup-form').addEventListener('submit', async function(event) {
        event.preventDefault();
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (password.length < 6) {
            alert("Password should be at least 6 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (response.ok) {
                alert("Registration successful! Please log in.");
                signUpForm.style.display = 'none';
                signInForm.style.display = 'block';
            } else {
                alert(data.message || "Registration failed.");
            }
        } catch (error) {
            console.error("Error during sign up:", error);
            alert("An error occurred during registration. Please try again.");
        }
    });
});