export function sanitizeMarkup(html: string): string {
    const temporaryContainer = document.createElement('div');
    temporaryContainer.innerHTML = html;

    sanitizeNode(temporaryContainer);

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
            if (
                forbiddenAttributes.has(attribute.name.toLowerCase()) ||
                attribute.name.startsWith('on') ||
                (unsafeUrlAttributes.has(attribute.name.toLowerCase()) && unsafeUrlPattern.test(attribute.value.trim()))
            ) {
                child.removeAttribute(attribute.name);
            }
        });

        sanitizeNode(child);
    });
}