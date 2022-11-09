const inputs = document.querySelectorAll('input[type="checkbox"], input[type="email"], input[type="text"], input[type="date"], input[type="datetime-local"], input[type="month"], input[type="number"]');

let keyPressed = false;
let timeStamp = false;

function handleInput(event, delay) {
    if (!timeStamp) {
        timeStamp = event.timeStamp;
    }
    if (event.timeStamp >= timeStamp + delay) {
        timeStamp = event.timeStamp;
    } else {
        event.preventDefault();
    }
}

inputs.length > 0 ? inputs.forEach(input => {
    input.addEventListener('keydown', (event) => {
        if (event.code !== "Backspace" && !event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey) {
            if (event.repeat) {
                handleInput(event, 2000);
            }

            if (!event.repeat && event.key === keyPressed) {
                handleInput(event, 500);
            }

            keyPressed = event.key;
        }
    });
}) : '';