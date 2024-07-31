export function postKeyboard(container: HTMLElement, baseClass: string) {
    let focusableElements: { [key: string]: HTMLElement[] } = {};

    const sidebar = container.querySelector(`.${baseClass}__sidebar`);
    
    if (!sidebar) return;

    document.addEventListener('keydown', (e: Event) => {
        const keyboardEvent = e as KeyboardEvent;
        const openPost = (sidebar.querySelector(`.${baseClass}__post-full.is-open`) as HTMLElement);
        const backButton = (openPost?.querySelector(`.${baseClass}__button-back`) as HTMLElement);
        
        switch (keyboardEvent.key) {
            case 'Escape':
                e.preventDefault();
                backButton?.click();
                document.body.classList.remove('u-overflow--hidden');
                break;
            
            case 'Tab': 
            if (openPost && openPost.hasAttribute('data-js-osm-full-post')) {
                    const openPostId = openPost.getAttribute('data-js-osm-full-post');
                    if (!openPostId) break;

                    if (!focusableElements[openPostId]) {
                        focusableElements[openPostId] = getFocusableElements(openPost);
                    }

                    const openPostFocusableElements = focusableElements[openPostId];
                    const currentIndex = openPostFocusableElements.indexOf(document.activeElement as HTMLElement);

                    keyboardEvent.preventDefault();
                    let nextIndex;

                    if (keyboardEvent.shiftKey) {
                        nextIndex = currentIndex === 0 ? openPostFocusableElements.length - 1 : currentIndex - 1;
                    } else {
                        nextIndex = currentIndex === openPostFocusableElements.length - 1 ? 0 : currentIndex + 1;
                    }
    
                    openPostFocusableElements[nextIndex].focus();
                }

                break;
        }
    });

    sidebar.addEventListener('keydown', (e: Event) => {
        const keyboardEvent = e as KeyboardEvent;
        switch (keyboardEvent.key) {
            case ' ':
            case 'Enter':
                e.preventDefault();
                
                const targetElement = e.target as HTMLElement;
                if (targetElement?.classList.contains(`${baseClass}__collection__item`)) {
                    targetElement.click();
                    break;
                }

                if (targetElement.classList.contains(`${baseClass}__button-back`)) {
                    targetElement.click();
                    break;
                }
        }
    });
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
    return Array.from(container.querySelectorAll(
        'a[href], button, textarea, input, select, details,[tabindex]:not([tabindex="-1"])'
    )) as HTMLElement[];
}