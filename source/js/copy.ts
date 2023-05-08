class Copy {

    constructor(element: Element) {
        this.copy(element);
    }

    copy(element: Element) {
        let target = element.getAttribute('data-js-copy-target');
        
        element.addEventListener('click', () => {
            console.log("click");
            let targetEl = target == "self" ? element : document.querySelector(`[data-js-copy-item="${target}"]`);

            if (targetEl && targetEl.hasAttribute('data-js-copy-data')) {
                let data = targetEl.getAttribute('data-js-copy-data') ?? '';

                if ('permissions' in navigator) {
                    navigator.permissions.query({ name: 'clipboard-write' as PermissionName})
                        .then((result) => {
                            if (result.state === 'granted' || result.state === 'prompt') {
                                navigator.clipboard.writeText(data)
                                    .then(() => {
                                        this.append(element, true);
                                    })
                                    .catch((error) => {
                                        console.error('Error copying text to clipboard:', error);
                                        console.log('Text copied to clipboard');

                                    });
                                } else {
                                    this.append(element, false);

                            }
                        })
                        .catch((error) => {
                            console.error('Error requesting permission:', error);
                            this.append(element, false);
                        });
                } else {
                    console.warn('Clipboard API not supported in this browser');
                    this.append(element, false);
                }

            } else return; 

        });
    }

    append(element: Element, success = false) {
        if (!element || !element.parentNode) return;
        const successNotice = element.getAttribute('data-js-copy-success') ?? 'Content was successfully copied.';
        const errorNotice = element.getAttribute('data-js-copy-error') ?? 'Something went wrong';
        const notice = success ? successNotice : errorNotice;

        let sibling = element.nextSibling;
        if (sibling instanceof Element && sibling.hasAttribute('js-data-copy-notice')) {
            sibling.textContent = notice;
        } else {
            const span = document.createElement('span');
            span.innerText = notice;
            span.setAttribute('js-data-copy-notice', '');
            element.parentNode.insertBefore(span, element.nextSibling);
        }
    }
}

export function setupCopy() {
    [...document.querySelectorAll('[data-js-copy-target]')].forEach(element => {
        new Copy(element);
    });
}

export default Copy;