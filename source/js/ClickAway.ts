export class ClickAway {
    constructor(private element: Element, private classesToRemove: string[]) {}

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
    }

}

export function initializeClickAways() {
    let clickAwayInstances: ClickAway[] = [];
    document.querySelectorAll('[data-js-click-away]').forEach((element) => {
        const classesToRemove = element.getAttribute('data-js-click-away')?.split(',');

        if (!classesToRemove || classesToRemove.length <= 0) return;

        clickAwayInstances.push(new ClickAway(element, classesToRemove));
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