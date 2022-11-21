/* Toggle expandable areas */

const CONTAINER = '[js-expand-container]';
const BUTTON = '[js-expand-button]';
const EXPANDED = 'aria-expanded';
const CONTROLS = 'aria-controls';
const HIDDEN = 'aria-hidden';


/**
 * Adds toggle event listeners to expandable elements
 */


/* const variableChanger = () => {
    let root = document.querySelector(':root');
    const header = document.querySelector('#site-header');
    window.addEventListener('resize', () => {
        console.log(getComputedStyle(root));
    });
}
variableChanger(); */
const expandSection = () => {
    const buttons = document.querySelectorAll(BUTTON);
    let i = 0;
    let prev = false;
    
    buttons.forEach((button) => {
        button.setAttribute('js-accordion-button', i);
        i++;

        button.addEventListener('click', function (e) {
            const expanded = button.getAttribute(EXPANDED) === 'true';
            toggleButton(button, expanded);
            prev = handleAnchor(button, prev, expanded, e);
        });
    });
};

const handleAnchor = (button, prev, expanded, e) => {
    if (prev && !expanded) {
        if (parseInt(button.getAttribute('js-accordion-button')) > parseInt(prev.getAttribute('js-accordion-button'))) {

        } else {
            e.preventDefault();
        }
    } else {
        e.preventDefault();
    }

    if (!expanded) {
        return button;

    } else {
        return false;
    }
}

/**
 * Toggles a button's and its siblings "pressed" state
 * @param {HTMLElement} button
 * @param {bool} expanded
 */
const toggleButton = (button, expanded) => {
    const container = button.closest(CONTAINER);
    let safeExpanded = expanded;

    if (!container) {
        throw new Error(`${BUTTON} is missing outer ${CONTAINER}`);
    }

    // Check if elemnt is a tab
    const isTab = button.getAttribute('role') === 'tab';
    // Bail if is tab and is already selected
    if (expanded && isTab) {
        return;
    }

    safeExpanded = toggle(button, !expanded);

    if (safeExpanded) {
        const containerButtons = container.querySelectorAll(BUTTON);

        containerButtons.forEach((other) => {
            if (other !== button) {
                toggle(other, false);
            }
        });
    }
};

/**
 * Toggle helper
 * @param {HTMLElement} button
 * @param {bool} expanded
 * @return {boolean} the resulting state
 */
const toggle = (button, expanded) => {
    let safeExpanded = expanded;

    if (typeof safeExpanded !== 'boolean') {
        safeExpanded = button.getAttribute(EXPANDED) === 'false';
    }

    button.setAttribute(EXPANDED, safeExpanded);

    const id = button.getAttribute(CONTROLS);
    const controls = document.getElementById(id);

    if (!controls) {
        throw new Error(`No toggle target found with id: "${id}"`);
    }

    if (safeExpanded) {
        controls.setAttribute(HIDDEN, 'false');
    } else {
        controls.setAttribute(HIDDEN, 'true');
    }

    return safeExpanded;
};

export default expandSection;
