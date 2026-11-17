/**
 * Connects drawer close buttons and viewport offsets to their native popovers.
 */
export function initializeDrawerAccessibility() {
    const drawers = document.querySelectorAll<HTMLElement>('[popover] > .c-drawer');
    const resizeObserver = new ResizeObserver(() => updateDrawerViewOffsets());

    drawers.forEach((drawer) => {
        const popover = drawer.parentElement;
        const closeButton = drawer.querySelector<HTMLButtonElement>('.c-drawer__close');
        if (!popover?.id || !closeButton) {
            console.error('A drawer popover requires an id and a close button.', drawer);
            return;
        }

        closeButton.removeAttribute('data-simulate-click');
        closeButton.setAttribute('popovertarget', popover.id);
        closeButton.setAttribute('popovertargetaction', 'hide');
        closeButton.setAttribute('aria-controls', popover.id);
        popover.addEventListener('toggle', updateDrawerViewOffsets);
        drawer.addEventListener('keydown', (event) => wrapDrawerFocus(event, drawer));
        resizeObserver.observe(drawer);
    });

    window.addEventListener('resize', updateDrawerViewOffsets);
    window.visualViewport?.addEventListener('resize', updateDrawerViewOffsets);
    updateDrawerViewOffsets();
}

/**
 * Wraps Tab navigation between the drawer's first and last available controls.
 *
 * @param event - The keyboard event originating inside the drawer.
 * @param drawer - The drawer containing the controls.
 */
function wrapDrawerFocus(event: KeyboardEvent, drawer: HTMLElement) {
    if (event.key !== 'Tab' || event.altKey || event.ctrlKey || event.metaKey) {
        return;
    }

    const root = drawer.getRootNode();
    const radios = root instanceof Document || root instanceof ShadowRoot
        ? [...root.querySelectorAll<HTMLInputElement>('input[type="radio"][name]')]
        : [];
    const controls = [...drawer.querySelectorAll<HTMLElement>(
        'a[href], area[href], button, input, select, textarea, iframe, [tabindex], [contenteditable]:not([contenteditable="false"]), audio[controls], video[controls], summary'
    )]
        .filter(isAvailableControl)
        .filter((element) => {
            if (!(element instanceof HTMLInputElement) || element.type !== 'radio' || !element.name) {
                return true;
            }

            const group = radios.filter((radio) =>
                radio.name === element.name && radio.form === element.form && isAvailableControl(radio)
            );
            return element === (group.find((radio) => radio.checked) ?? group[0]);
        })
        .sort((first, second) => (first.tabIndex || Infinity) - (second.tabIndex || Infinity));

    const first = controls[0];
    const last = controls[controls.length - 1];
    if (first && last && (event.shiftKey ? document.activeElement === first : document.activeElement === last)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
    }
}

/**
 * Checks whether a control is available for sequential keyboard navigation.
 *
 * @param element - The control to check.
 * @returns Whether the control can participate in Tab navigation.
 */
function isAvailableControl(element: HTMLElement): boolean {
    return element.tabIndex >= 0 &&
        !element.matches(':disabled') &&
        !element.closest('[inert]') &&
        element.getClientRects().length > 0 &&
        getComputedStyle(element).visibility === 'visible';
}

/**
 * Updates global view offsets based on currently open drawer popovers.
 */
export function updateDrawerViewOffsets() {
    const openDrawers = [...document.querySelectorAll<HTMLElement>('[popover]:popover-open > .c-drawer')];
    const baseUnit = getBaseUnitInPixels();
    const leftOffset = getMaxDrawerOffsetInBaseUnits(
        openDrawers.filter((drawer) => drawer.parentElement?.getAttribute('data-js-popover-horizontal-placement') === 'left'),
        baseUnit
    );
    const rightOffset = getMaxDrawerOffsetInBaseUnits(
        openDrawers.filter((drawer) => drawer.parentElement?.getAttribute('data-js-popover-horizontal-placement') === 'right'),
        baseUnit
    );

    setViewOffset('left', leftOffset);
    setViewOffset('right', rightOffset);
}

/**
 * Sets a global view offset and easing direction for the side being updated.
 *
 * @param side - The viewport side being offset.
 * @param offset - The offset expressed as a base-unit multiplier.
 */
function setViewOffset(side: 'left'|'right', offset: number) {
    const property = `--view-offset-${side}`;
    const currentOffset = Number.parseFloat(document.documentElement.style.getPropertyValue(property)) || 0;
    const easing = offset < currentOffset ? 'ease-in' : 'ease-out';

    document.documentElement.style.setProperty(`--view-offset-${side}-transition-easing`, easing);
    document.documentElement.style.setProperty(property, offset.toString());
}

/**
 * Gets the largest drawer width in base units from a drawer list.
 *
 * @param drawers - Drawers to measure.
 * @param baseUnit - Current base unit size in pixels.
 * @returns The largest drawer width expressed as a base-unit multiplier.
 */
function getMaxDrawerOffsetInBaseUnits(drawers: HTMLElement[], baseUnit: number) {
    const maxWidth = drawers.reduce((width, drawer) => {
        const drawerWidth = drawer.getBoundingClientRect().width || drawer.offsetWidth;

        return Math.max(width, drawerWidth);
    }, 0);

    return Number((maxWidth / baseUnit).toFixed(4));
}

/**
 * Resolves the current CSS base unit in pixels.
 *
 * @returns The base unit size in pixels.
 */
function getBaseUnitInPixels() {
    const rawBaseValue = getComputedStyle(document.documentElement).getPropertyValue('--base').trim();
    const parsedBaseValue = Number.parseFloat(rawBaseValue);

    if (rawBaseValue.endsWith('px') && parsedBaseValue > 0) {
        return parsedBaseValue;
    }

    const measuringElement = document.createElement('div');
    measuringElement.style.position = 'absolute';
    measuringElement.style.visibility = 'hidden';
    measuringElement.style.width = 'var(--base, 8px)';
    document.body.appendChild(measuringElement);

    const measuredBaseValue = measuringElement.getBoundingClientRect().width;
    measuringElement.remove();

    return measuredBaseValue || 8;
}
