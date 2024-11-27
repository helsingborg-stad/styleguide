export class ClickAway {
    constructor(
        private element: Element, 
        private classesToRemove: string[],
        private removePressed: NodeListOf<Element>
    ) {}

    public handleClickAway(target: Element): void {
        if (this.element.contains(target)) return;
        
        this.removeClasses();
    }

    public removeClasses(): void {
        this.classesToRemove.forEach(className => {
            if (this.element.classList.contains(className)) {
                this.element.classList.remove(className);
            }
        });

        if (this.element.hasAttribute('aria-pressed')) {
            this.element.setAttribute('aria-pressed', 'false');
        }

        this.removePressed.forEach(element => {
            element.setAttribute('aria-pressed', 'false');
        });
    }

}

export function initializeClickAways() {
    let clickAwayInstances: ClickAway[] = [];
    document.querySelectorAll('[data-js-click-away]').forEach((element) => {
        const classesToRemove =
            element.getAttribute('data-js-click-away')?.
            split(',').
            map(className => className.trim());

        if (!classesToRemove || classesToRemove.length <= 0) return;

        const removePressed = element.querySelectorAll('[aria-pressed][data-js-click-away-remove-pressed]');

        clickAwayInstances.push(new ClickAway(element, classesToRemove, removePressed));
    });

    if (clickAwayInstances.length <= 0) return;

    document.addEventListener('click', (e) => {
        const target = e.target as Element;
        if (!target) return;

        clickAwayInstances.forEach(clickAwayInstance => {
            clickAwayInstance.handleClickAway(target);
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            clickAwayInstances.forEach(clickAwayInstance => {
                clickAwayInstance.removeClasses();
            });
        }
    });
}