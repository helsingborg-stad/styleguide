import { ImoveElement } from "./moveElement";

const moveToSelector = '[data-move-to]'
const moveToAttributeName = 'data-move-to'

const canMoveTo = (moveTo: string | null): moveTo is string => {
    return moveToSelector && document.querySelector(moveToSelector) !== null
}

export const moveElements = (moveElement: ImoveElement) => {
    const elements = document.querySelectorAll(moveToSelector)

    elements.forEach((element) => {
        const moveToSelector = element.getAttribute(moveToAttributeName)

        if (canMoveTo(moveToSelector)) {
            moveElement(element, document.querySelector(moveToSelector) as Element)
            element.removeAttribute(moveToAttributeName)
        }
    })
}