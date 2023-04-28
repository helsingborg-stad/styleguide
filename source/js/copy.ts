class Copy {

    constructor(element: Element) {
        this.copy(element);
    }

    copy(element: Element) {
        let target = element.getAttribute('data-js-copy-target');
        
        element.addEventListener('click', () => {
            let targetEl = target == "self" ? element : document.querySelector(`[data-js-copy-item="${target}"]`);

            if (targetEl && targetEl.hasAttribute('data-js-copy-data')) {
                let data = targetEl.getAttribute('data-js-copy-data') ?? '';

                if ('permissions' in navigator) {
                    navigator.permissions.query({ name: 'clipboard-write' as PermissionName})
                        .then((result) => {
                            if (result.state === 'granted' || result.state === 'prompt') {
                                navigator.clipboard.writeText(data)
                                    .then(() => {
                                        console.log('Text copied to clipboard');
                                    })
                                    .catch((error) => {
                                        console.error('Error copying text to clipboard:', error);
                                    });
                            } else {
                                console.warn('Permission to write to the clipboard denied');
                            }
                        })
                        .catch((error) => {
                            console.error('Error requesting permission:', error);
                        });
                } else {
                    console.warn('Clipboard API not supported in this browser');
                }

            } else return; 

        });
    }
}

export function setupCopy() {
    [...document.querySelectorAll('[data-js-copy-target]')].forEach(element => {
        new Copy(element);
    });
}

export default Copy;