function updateProgressBar(percentage) {
    var progressBar = document.getElementById('progress-bar');
    progressBar.style.width = percentage + '%';
}

// Example of updating the progress to 50%:
updateProgressBar(50);
