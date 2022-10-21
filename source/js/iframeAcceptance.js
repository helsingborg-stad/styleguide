let acceptedSuppliers = JSON.parse(localStorage.getItem('acceptedSuppliers')) ?? [];

/* Sets local storage */
const setLocalStorage = (contentWrapper) => {
    const iframeUrl = new URL(contentWrapper.getAttribute('data-src'));
    if (!acceptedSuppliers.includes(iframeUrl.host) && iframeUrl.host !== "https" && iframeUrl.host !== "http") {
        acceptedSuppliers.push(iframeUrl.host);
    }
    localStorage.setItem('acceptedSuppliers', JSON.stringify(acceptedSuppliers));
}

/* Reveal function */
const revealContent = (contentWrapper) => {
    const template = contentWrapper.querySelector('template');
    const iframeContent = contentWrapper.querySelector('.c-acceptance__content');
    let clone = template.content.cloneNode(true);
    iframeContent.appendChild(clone);
    const iframe = template.nextElementSibling;
    contentWrapper.classList.remove('js-suppressed-content');
    contentWrapper.querySelector('.js-suppressed-content-prompt').classList.add('u-display--none');
    iframe.setAttribute('src', iframe.getAttribute('data-src'));
}

/* Loops through an reveal every URL-host matching local storage */
const revealContentLoop = () => {
    [...document.querySelectorAll('.js-suppressed-content')]
    .forEach(contentWrapper => {
        if (contentWrapper.classList.contains('js-suppressed-content--none')) {
            const iframeUrl = new URL(contentWrapper.getAttribute('data-src'));
            if(acceptedSuppliers.includes(iframeUrl.host)) {
                revealContent(contentWrapper);
            }  
        }
    }); 
}

const handleEvents = (contentWrapper) => {
    /* Sets local storage  */
    setLocalStorage(contentWrapper);

    /* Modifiers (else equals no modifier) */
    if (contentWrapper.classList.contains('js-suppressed-content--video')) {
        revealContent(contentWrapper);
    } else {
        revealContentLoop();
    }
}

/* Adds click events for all suppressed content */
const setEvents = () => {
    [...document.querySelectorAll('.js-suppressed-content')]
    .forEach(contentWrapper => {
        const buttonEl = contentWrapper.querySelector('[js-suppressed-content-button]');
        buttonEl.addEventListener('click', () => {
        handleEvents(contentWrapper);
        });  
    });
}

export default () => addEventListener('DOMContentLoaded', () => {
    if (acceptedSuppliers.length > 0 && document.querySelectorAll('.js-suppressed-content').length > 0 ) {
        /* No modifiers */
        [...document.querySelectorAll('.js-suppressed-content--none')].forEach(contentWrapper => {
            const iframeUrl = new URL(contentWrapper.getAttribute('data-src'));
            if (acceptedSuppliers.includes(iframeUrl.host) && contentWrapper.classList.contains('js-suppressed-content--none')) {
                revealContent(contentWrapper);
            }
        })
        /* More modifiers... */
    }
    document.querySelectorAll('.js-suppressed-content').length > 0 ? setEvents() : '';
});

