document.addEventListener('DOMContentLoaded', function () {
    const text = "To Be Developed Later";
    const typingText = document.getElementById('typing-text');
    let index = 0;
    let isDeleting = false;

    function typeLetter() {
        if (!isDeleting && index < text.length) {
            typingText.innerHTML = text.substring(0, index + 1);
            index++;
            setTimeout(typeLetter, 125); 
        } else if (!isDeleting && index === text.length) {
            setTimeout(() => {
                isDeleting = true;
                typeLetter();
            }, 3000); 
        } else if (isDeleting && index >= 0) {
            typingText.innerHTML = text.substring(0, index);
            index--;
            setTimeout(typeLetter, 75); 
        } else if (isDeleting && index < 0) {
            isDeleting = false;
            index = 0;
            setTimeout(typeLetter, 100); 
        }
    }

    typeLetter();
});
