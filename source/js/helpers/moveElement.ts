export interface ImoveElement {
    (element: Element, target: Element): void
}

export const moveElement:ImoveElement = (element, target) => {
    target.appendChild(element)
}