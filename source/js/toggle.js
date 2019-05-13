/* Toggling classes */

class ToggleClass {

    constructor() {
        this.toggleElements = document.querySelectorAll("[js-toggle-class]");
        this.init();
    }

    init() {
        this.toggleElements.forEach(function (element) {
            let toggleClass = element.getAttribute('js-toggle-class');

            element.addEventListener('click', function () {
                element.classList.toggle(toggleClass);
            });
        });
    }
}

export default ToggleClass;
