document.addEventListener("DOMContentLoaded", function () {
  const quizForm = document.getElementById("quiz-form");
  const submitButton = document.getElementById("submit-button");
  const resultText = document.getElementById("quiz-result");
  const allOptions = document.querySelectorAll(".quiz-option");
  const pointDisplay = document.getElementById("points"); // Element to display points in UI
  let selectedAnswer = null;
  let attemptCount = 0; // Track the number of attempts

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
      const selectedOption = document.querySelector(`.quiz-option[data-key="${key}"]`);
      if (selectedOption) {
        selectedOption.querySelector('input[type="radio"]').checked = true;
        selectedAnswer = selectedOption.querySelector('input[type="radio"]');
        submitButton.disabled = false;
      }
    }
  });

  // Form submission logic
  quizForm.addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form refresh

    let pointsEarned = 0;

    if (selectedAnswer && selectedAnswer.value === "correct") {
      attemptCount++; // Increase attempt count on correct answer

      // Determine points based on attempt count
      if (attemptCount === 1) {
        pointsEarned = 10; // 10 points for first attempt correct
      } else if (attemptCount === 2) {
        pointsEarned = 7; // 7 points for second attempt correct
      } else if (attemptCount === 3) {
        pointsEarned = 5; // 5 points for third attempt correct
      } else if (attemptCount === 4) {
        pointsEarned = 3; // 3 points for fourth attempt correct
      }

      resultText.textContent = "Correct! Well done!";
      resultText.style.color = "green";
      selectedAnswer.parentElement.style.backgroundColor = "#d4edda"; // Green for correct

      // Play sound
      const audio = new Audio("../../assets/sound/correct.mp3");
      audio.play();

      // Disable form
      const elements = quizForm.elements;
      for (let i = 0, len = elements.length; i < len; ++i) {
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

      pointsEarned = 1; // 1 point for incorrect attempt
      attemptCount++; // Increase attempt count on incorrect answer
    }

    // Update points in the backend
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await fetch("https://pywhiz-be.vercel.app/update-points", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ points: pointsEarned }),
        });

        const result = await response.json();
        if (response.ok) {
          console.log("Points updated successfully!", result);

          // Animate points change
          const currentPoints = parseInt(pointDisplay.innerText);
          const newPoints = result.new_points;
          animatePoints(currentPoints, newPoints);
        } else {
          console.error("Failed to update points:", result.message);
        }
      } catch (error) {
        console.error("Error updating points:", error);
      }
    }
  });

  // Function to animate points change in UI
  function animatePoints(start, end) {
    const duration = 1000; // Animation duration in milliseconds
    const stepTime = Math.abs(Math.floor(duration / (end - start)));
    let currentPoints = start;

    const interval = setInterval(() => {
      currentPoints = start < end ? currentPoints + 1 : currentPoints - 1;
      pointDisplay.innerText = currentPoints;

      if (currentPoints === end) {
        clearInterval(interval);
      }
    }, stepTime);
  }
});
