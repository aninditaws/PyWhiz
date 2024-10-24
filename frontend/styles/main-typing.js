// Typing Text in Welcoming Page
const typingText = document.getElementById('typing-text');

// Array of words to be typed
const words = ["Sekarang!", "Besok!", "Kapanpun!"];
let wordIndex = 0;
let letterIndex = 0;
let currentWord = "";
let isDeleting = false;
let typingSpeed = 150; 

function type() {
  currentWord = words[wordIndex];

  if (!isDeleting) {
    typingText.innerHTML = currentWord.slice(0, letterIndex + 1);
    letterIndex++;

    if (letterIndex === currentWord.length) {
      isDeleting = true;
      setTimeout(type, 2000); 
    } else {
      setTimeout(type, typingSpeed);
    }
  } else {
    typingText.innerHTML = currentWord.slice(0, letterIndex - 1);
    letterIndex--;

    if (letterIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      setTimeout(type, 500); 
    } else {
      setTimeout(type, typingSpeed);
    }
  }
}

type();