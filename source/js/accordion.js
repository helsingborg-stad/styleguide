/* Toggling accordion items */

export default function accordion() {

    function addClass(el, elementClass) {
        el.classList.add(elementClass);
    }

    function removeClass(el, elementClass) {
        el.classList.remove(elementClass);
    }

    const accordionItems = document.querySelectorAll('[js-toggle-accordion]');
    const accordionContentPanes = document.querySelectorAll('.c-accordion__content');

    // Hide each besides the targeted accordion on click
    accordionItems.forEach(function (accordion) {
        const accordionTitleRow = accordion.firstElementChild;
        accordionTitleRow.addEventListener('click', toggleAccordion);
    });

    function toggleAccordion(e) {
        accordionContentPanes.forEach(function (content) {
            // Check if clicked row matches the content's previous element sibling
            const section = content.closest('.c-accordion__section');
            if (content.previousElementSibling === e.target.closest('.c-accordion__heading') && !section.classList.contains('c-accordion__section--open')) {
                addClass(section, 'c-accordion__section--open');
                removeClass(section, 'c-accordion__section--close');
            } else {

                if (section.classList.contains('c-accordion__section--open')) {
                    addClass(section, 'c-accordion__section--close');
                }

                removeClass(section, 'c-accordion__section--open');
            }
        });
    }

}

accordion();
