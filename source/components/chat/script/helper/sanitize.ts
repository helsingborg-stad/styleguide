const ALLOWED_CLASS_NAMES = new Set(['c-chat__message--pending']);

export function sanitizeMarkup(html: string): string {
    const temporaryContainer = document.createElement('div');
    temporaryContainer.innerHTML = html;

    sanitizeNode(temporaryContainer);
    cleanupWhitespaceNodes(temporaryContainer);

    return temporaryContainer.innerHTML;
}

function sanitizeNode(node: Element): void {
    const forbiddenTags = new Set(['script', 'style', 'iframe', 'object', 'embed', 'form', 'link', 'meta', 'base', 'button', 'img']);
    const forbiddenAttributes = new Set(['style']);
    const unsafeUrlAttributes = new Set(['href', 'src', 'action', 'formaction']);
    const unsafeUrlPattern = /^(javascript|data|vbscript):/i;

    Array.from(node.children).forEach(child => {
        if (forbiddenTags.has(child.tagName.toLowerCase())) {
            child.remove();
            return;
        }

        Array.from(child.attributes).forEach(attribute => {
            if (attribute.name.toLowerCase() === 'class') {
                sanitizeClassAttribute(child, attribute.value);
                return;
            }

            if (
                forbiddenAttributes.has(attribute.name.toLowerCase()) ||
                attribute.name.startsWith('on') ||
                (unsafeUrlAttributes.has(attribute.name.toLowerCase()) && unsafeUrlPattern.test(attribute.value.trim()))
            ) {
                child.removeAttribute(attribute.name);
            }
        });

        sanitizeNode(child);

        if (shouldReplaceWrapperWithLineBreak(child)) {
            replaceWrapperWithLineBreaks(child);
            return;
        }

        if (shouldRemoveEmptyElement(child)) {
            child.remove();
        }
    });
}

function replaceWrapperWithLineBreaks(element: Element): void {
    const lineBreakCount = Math.max(1, element.querySelectorAll('br').length);
    const fragment = document.createDocumentFragment();

    Array.from({ length: lineBreakCount }).forEach(() => {
        fragment.appendChild(document.createElement('br'));
    });

    element.replaceWith(fragment);
}

function shouldReplaceWrapperWithLineBreak(element: Element): boolean {
    if (element.tagName.toLowerCase() === 'br') {
        return false;
    }

    const normalizedTextContent = getNormalizedTextContent(element);
    const hasLineBreakDescendant = element.querySelector('br') !== null;
    const isLineBreakWrapper = hasLineBreakDescendant && normalizedTextContent.length === 0;

    return isLineBreakWrapper;
}

function shouldRemoveEmptyElement(element: Element): boolean {
    if (element.tagName.toLowerCase() === 'br') {
        return false;
    }

    if (isPendingElement(element) || isInsidePendingElement(element)) {
        return false;
    }

    const hasElementChildren = element.children.length > 0;
    const normalizedTextContent = getNormalizedTextContent(element);

    return !hasElementChildren && normalizedTextContent.length === 0;
}

function sanitizeClassAttribute(element: Element, className: string): void {
    const allowedClasses = className
        .split(/\s+/)
        .filter((candidate) => ALLOWED_CLASS_NAMES.has(candidate));

    if (allowedClasses.length === 0) {
        element.removeAttribute('class');
        return;
    }

    element.setAttribute('class', allowedClasses.join(' '));
}

function cleanupWhitespaceNodes(node: Node): void {
    Array.from(node.childNodes).forEach((childNode) => {
        if (childNode.nodeType === Node.TEXT_NODE) {
            normalizeWhitespaceTextNode(childNode as Text);
            return;
        }

        if (childNode.nodeType === Node.ELEMENT_NODE) {
            cleanupWhitespaceNodes(childNode);
        }
    });
}

function normalizeWhitespaceTextNode(textNode: Text): void {
    if (!isWhitespaceOnlyTextNode(textNode)) {
        return;
    }

    const previousSibling = getAdjacentMeaningfulSibling(textNode, 'previousSibling');
    const nextSibling = getAdjacentMeaningfulSibling(textNode, 'nextSibling');

    if (!previousSibling || !nextSibling || isBoundaryNode(previousSibling) || isBoundaryNode(nextSibling)) {
        textNode.remove();
        return;
    }

    textNode.textContent = ' ';
}

function getAdjacentMeaningfulSibling(node: Node, direction: 'previousSibling' | 'nextSibling'): Node | null {
    let sibling = node[direction];

    while (sibling) {
        if (sibling.nodeType !== Node.TEXT_NODE) {
            return sibling;
        }

        if (!isWhitespaceOnlyTextNode(sibling as Text)) {
            return sibling;
        }

        sibling = sibling[direction];
    }

    return null;
}

function isBoundaryNode(node: Node): boolean {
    if (node.nodeType !== Node.ELEMENT_NODE) {
        return false;
    }

    const tagName = (node as Element).tagName.toLowerCase();

    return new Set(['br', 'div', 'p', 'li']).has(tagName);
}

function isWhitespaceOnlyTextNode(textNode: Text): boolean {
    return textNode.textContent?.replace(/[\u00A0\u200B-\u200D\uFEFF]/g, ' ').trim().length === 0;
}

function getNormalizedTextContent(element: Element): string {
    return (element.textContent ?? '')
        .replace(/\u00A0/g, ' ')
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
        .trim();
}

function isPendingElement(element: Element): boolean {
    return element.classList.contains('c-chat__message--pending');
}

function isInsidePendingElement(element: Element): boolean {
    return element.closest('.c-chat__message--pending') !== null;
}