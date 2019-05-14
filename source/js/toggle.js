/* Toggling classes */

const toggleClass = () => {
    const toggleElements = document.querySelectorAll("[js-toggle-class]");

    toggleElements.forEach(function (element) {
        let toggleClass = element.getAttribute('js-toggle-class');

        element.addEventListener('click', function () {
            element.classList.toggle(toggleClass);
        });
    });
}

export default toggleClass;
