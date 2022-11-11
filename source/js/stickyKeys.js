/**
 * HANDLE STICKY KEYS
 * This function makes it easier to fill in forms 
 * by not allowing multiple keystrokes of the same 
 * character in specified amount of time.
 */

 class StickyKeys {

    constructor() {

        this.keyPressed = false;
        this.timeStamp = false;

        const inputTypes = [
            'input[type="checkbox"]',
            'input[type="email"]',
            'input[type="text"]',
            'input[type="date"]',
            'input[type="search"]',
            'input[type="datetime-local"]',
            'input[type="month"]',
            'input[type="number"]'
        ];

        this.subscribeInput(
            [
                ...document.querySelectorAll(
                    inputTypes.join(", ")
                )
            ]
        ); 

    }

    subscribeInput(targetElements) {
        (targetElements.forEach(input => {
            input.addEventListener('keydown', (event) => {
                if (event.code !== "Backspace" && !event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey) {
                    if (event.repeat) {
                        this.handleInput(event, 2000);
                    }
        
                    if (!event.repeat && event.key === this.keyPressed) {
                        this.handleInput(event, 500);
                    }
        
                    this.keyPressed = event.key;
                }
            });
        }));
    }

    handleInput(event, delay) {
        if (!this.timeStamp) {
            this.timeStamp = event.timeStamp;
        }

        if (event.timeStamp >= this.timeStamp + delay) {
            this.timeStamp = event.timeStamp;
        } else {
            event.preventDefault();
        }
    }

}

export default StickyKeys;