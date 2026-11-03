import DrawerAccessibility, { updateDrawerViewOffsets } from './drawerAccessibility';

describe('DrawerAccessibility', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        document.documentElement.removeAttribute('style');
        document.documentElement.style.setProperty('--base', '8px');
    });

    it('sets the right view offset from an open right drawer width in base units', () => {
        const button = document.createElement('button');
        const drawer = createDrawer(['c-drawer--right', 'is-open'], 320);
        document.body.append(button, drawer);

        new DrawerAccessibility(button, drawer);

        expect(document.documentElement.style.getPropertyValue('--view-offset-right')).toBe('40');
        expect(document.documentElement.style.getPropertyValue('--view-offset-right-transition-easing')).toBe('ease-out');
        expect(document.documentElement.style.getPropertyValue('--view-offset-left')).toBe('0');
    });

    it('resets the right view offset when no right drawer is open', () => {
        const drawer = createDrawer(['c-drawer--right'], 320);
        document.body.appendChild(drawer);

        updateDrawerViewOffsets();

        expect(document.documentElement.style.getPropertyValue('--view-offset-right')).toBe('0');
    });

    it('sets closing easing when a right drawer offset contracts', () => {
        document.documentElement.style.setProperty('--view-offset-right', '40');
        const drawer = createDrawer(['c-drawer--right'], 320);
        document.body.appendChild(drawer);

        updateDrawerViewOffsets();

        expect(document.documentElement.style.getPropertyValue('--view-offset-right')).toBe('0');
        expect(document.documentElement.style.getPropertyValue('--view-offset-right-transition-easing')).toBe('ease-in');
    });

    it('sets the left view offset from an open left drawer width in base units', () => {
        const drawer = createDrawer(['is-open'], 256);
        document.body.appendChild(drawer);

        updateDrawerViewOffsets();

        expect(document.documentElement.style.getPropertyValue('--view-offset-left')).toBe('32');
        expect(document.documentElement.style.getPropertyValue('--view-offset-right')).toBe('0');
    });

    it('sets aria-hidden to false when initialized with an open drawer', () => {
        const button = document.createElement('button');
        const drawer = createDrawer(['is-open'], 256);
        document.body.append(button, drawer);

        new DrawerAccessibility(button, drawer);

        expect(drawer.getAttribute('aria-hidden')).toBe('false');
    });

    it('does not move focus into drawer when clicking trigger closes it', () => {
        jest.useFakeTimers();

        const button = document.createElement('button');
        const drawer = createDrawer(['is-open'], 256);

        button.setAttribute('data-js-toggle-trigger', 'mobile');
        drawer.setAttribute('data-js-toggle-item', 'mobile');

        button.addEventListener('click', () => {
            drawer.classList.toggle('is-open');
        });

        document.body.append(button, drawer);

        new DrawerAccessibility(button, drawer);

        button.focus();
        button.click();
        jest.runAllTimers();

        expect(drawer.classList.contains('is-open')).toBe(false);
        expect(document.activeElement).toBe(button);

        jest.useRealTimers();
    });
});

/**
 * Creates a drawer fixture with a deterministic layout width.
 *
 * @param classList - Additional drawer classes.
 * @param width - Drawer width in pixels.
 * @returns A drawer element for tests.
 */
function createDrawer(classList: string[], width: number) {
    const drawer = document.createElement('nav');
    drawer.classList.add('c-drawer', ...classList);
    drawer.innerHTML = [
        '<button class="c-drawer__close"></button>',
        '<div class="c-drawer__body"><a href="#">Item</a></div>'
    ].join('');
    Object.defineProperty(drawer, 'offsetWidth', {
        configurable: true,
        value: width
    });
    drawer.getBoundingClientRect = () => ({
        bottom: 0,
        height: 0,
        left: 0,
        right: width,
        top: 0,
        width,
        x: 0,
        y: 0,
        toJSON: () => null
    });

    return drawer;
}