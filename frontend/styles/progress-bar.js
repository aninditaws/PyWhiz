document.addEventListener("DOMContentLoaded", function () {
  const pages = {
    "module1.html": 1,
    "module1-quiz.html": 2,
    "module2.html": 3,
    "module2-quiz.html": 4,
    "module3.html": 5,
    "module3-quiz.html": 6,
    "module4.html": 7,
    "module4-quiz.html": 8,
  };

  const currentPage = window.location.pathname.split("/").pop();
  const totalPages = 8;
  const currentPageNumber = pages[currentPage] || 1;
  const progressPercentage = ((currentPageNumber - 1) / totalPages) * 100;

  const progressBar = document.querySelector(".progress-bar-fill");
  progressBar.style.width = progressPercentage + "%";
});
