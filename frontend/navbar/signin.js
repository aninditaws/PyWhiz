// Sign In Logic
document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('authModal');
    const signInForm = document.getElementById('signinForm');
    const signUpForm = document.getElementById('signupForm');
    const signInLink = document.getElementById('showSignin');
    const signUpLink = document.getElementById('showSignup');
    const openModalButton = document.getElementById('openModal');
    const closeModalButton = document.getElementsByClassName('close')[0];

    // Open the modal when clicking "Sign In"
    openModalButton.addEventListener('click', function () {
        modal.style.display = 'flex'; // Show the modal
        signInForm.style.display = 'block'; // Default to Sign In form
        signUpForm.style.display = 'none'; // Hide Sign Up form initially
    });

    // Close the modal when clicking the "X"
    closeModalButton.addEventListener('click', function () {
        modal.style.display = 'none'; // Hide the modal
    });

    // Switch to Sign Up form
    signUpLink.addEventListener('click', function () {
        signInForm.style.display = 'none';
        signUpForm.style.display = 'block';
    });

    // Switch back to Sign In form
    signInLink.addEventListener('click', function () {
        signUpForm.style.display = 'none';
        signInForm.style.display = 'block';
    });

    // Close the modal if clicking outside of it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    document.getElementById('signin-form').addEventListener('submit', function(event) {
        event.preventDefault();  // Prevent the default form submission
    
        // Assuming we have the logic to check credentials
        const email = document.getElementById('signin-email').value;
        const password = document.getElementById('signin-password').value;
    
        // Simulate a successful login by hardcoding credentials
        if(email === 'user@example.com' && password === 'password123') {
            // Successful login logic here
            window.location.href = './home.html'; 
        } else {
            // Show error if credentials are wrong
            alert('Incorrect email or password. Please try again.');
        }
    });
});
