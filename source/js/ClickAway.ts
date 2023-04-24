export class ClickAway {
    static attributeName = 'data-js-click-away'
    element: Element
    classesToRemove: string[] = []

    constructor(element: Element) {
        this.element = element
    }

    initialize() {
        this.setClassesToRemove(this.element)
        document.addEventListener('click', (event) => this.handleClick(event as PointerEvent))
    }

    handleClick(event: PointerEvent) {

        const boundingRect = this.element.getBoundingClientRect()
        if (!this.coordinatesAreOutsideBounds(boundingRect, event.clientX, event.clientY)) return
        if (this.targetIsOnOrWithinElement(this.element, event.target as Element)) return

        this.removeClasses(this.element, this.classesToRemove)
    }

    removeClasses(element: Element, classes: string[]) {
        classes.forEach(className => {
            element.classList.remove(className)
        })
    }

    setClassesToRemove(element: Element) {
        const classesString = element.getAttribute(ClickAway.attributeName)
        if (classesString) {
            this.classesToRemove = classesString.split(',').map(s => s.trim())
        }
    }

    coordinatesAreOutsideBounds(bounds: { left: number, right: number, top: number, bottom: number }, x: number, y: number) {
        if (x < bounds.left) return true;
        if (x > bounds.right) return true;
        if (y < bounds.top) return true;
        if (y > bounds.bottom) return true;

        return false;
    }

    targetIsOnOrWithinElement(element: Element, target: Element): boolean {
        if (target === element) return true
        return element.contains(target)
    }
}

export function initializeClickAways() {
    const elements = document.querySelectorAll(`[${ClickAway.attributeName}]`)
    elements.forEach(element => {
        const clickAway = new ClickAway(element)
        clickAway.initialize()
    })
}