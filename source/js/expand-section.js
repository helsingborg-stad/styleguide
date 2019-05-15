/* Toggle expandable areas */

const CONTAINER = '[js-expand-container]';
const BUTTON = '[js-expand-button]';
const TOGGLEDISABLED = 'js-disable-toggle';
const EXPANDED = 'aria-expanded';
const CONTROLS = 'aria-controls';
const HIDDEN = 'aria-hidden';

/**
 * Adds toggle event listeners to expandable elements
 */
const expandSection = () => {
    const buttons = document.querySelectorAll(BUTTON);

    buttons.forEach((button) => {
        button.addEventListener('click', function (e) {
            e.preventDefault();

            const expanded = button.getAttribute(EXPANDED) === 'true';
            toggleButton(button, expanded);
        });
    });
};

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

    const toggleDisabled = button.getAttribute(TOGGLEDISABLED) === 'true';
    // Bail if toggling is disabled for already selected elements
    if (expanded && toggleDisabled) {
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
