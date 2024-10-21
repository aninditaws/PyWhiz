// progress.js
document.addEventListener('DOMContentLoaded', function () {
    // Mapping each page to its respective number
    const pages = {
        "module1.html": 1,
        "module1-quiz.html": 2,
        "module2.html": 3,
        "module2-quiz.html": 4,
        "module3.html": 5,
        "module3-quiz.html": 6,
        "module4.html": 7,
        "module4-quiz.html": 8
    };

    // Get current page filename
    const currentPage = window.location.pathname.split("/").pop();
    
    // Get total pages (for this case, 8)
    const totalPages = 8;
    
    // Calculate the percentage based on the formula (current page - 1) / total pages
    let currentPageNumber = pages[currentPage] || 1; // Fallback to 1 if not found
    let progressPercentage = ((currentPageNumber - 1) / totalPages) * 100;

    // Select the progress bar element
    const progressBar = document.querySelector('.progress-bar-fill');

    // Set the width of the progress bar based on the percentage
    progressBar.style.width = progressPercentage + '%';
});
