document.addEventListener("DOMContentLoaded", function () {
  const quizForm = document.getElementById("quiz-form");
  const submitButton = document.getElementById("submit-button");
  const resultText = document.getElementById("quiz-result");
  const allOptions = document.querySelectorAll(".quiz-option");
  let selectedAnswer = null;

  // Enable submit button once an answer is selected
  allOptions.forEach((option) => {
    option.addEventListener("click", function () {
      if (!this.querySelector('input[type="radio"]').disabled) {
        this.querySelector('input[type="radio"]').checked = true;
        selectedAnswer = this.querySelector('input[type="radio"]');
        submitButton.disabled = false;
      }
    });
  });

  // Listen for keyboard input (1, 2, 3)
  document.addEventListener("keydown", function (event) {
    const key = event.key;
    if (key >= "1" && key <= allOptions.length.toString()) {
      const selectedOption = document.querySelector(
        `.quiz-option[data-key="${key}"]`
      );
      if (selectedOption) {
        selectedOption.querySelector('input[type="radio"]').checked = true;
        selectedAnswer = selectedOption.querySelector('input[type="radio"]');
        submitButton.disabled = false;
      }
    }
  });

  // Form submission logic
  quizForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form refresh

    if (selectedAnswer && selectedAnswer.value === "correct") {
      resultText.textContent = "Correct! Well done!";
      resultText.style.color = "green";
      selectedAnswer.parentElement.style.backgroundColor = "#d4edda"; // Green for correct

      // Play sound
      const audio = new Audio("../../assets/sound/correct.mp3");
      audio.play();

      // Disable form
      var elements = quizForm.elements;
      for (var i = 0, len = elements.length; i < len; ++i) {
        elements[i].disabled = true;
      }

      // Show next button
      document.getElementById("next-button").hidden = false;
      document.getElementById("submit-button").hidden = true;
    } else {
      resultText.textContent = "Incorrect. Try again!";
      resultText.style.color = "red";
      selectedAnswer.parentElement.style.backgroundColor = "#f8d7da"; // Red for incorrect
      // Play sound
      const audio = new Audio("../../assets/sound/wrong.mp3");
      audio.play();
    }
  });
});
