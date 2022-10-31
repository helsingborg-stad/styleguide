let acceptedSuppliers = JSON.parse(localStorage.getItem('acceptedSuppliers')) ?? [];

/* Undefined check */
const hasSuppressedContent = (modifier) => {
    let suppressedContentExists = document.querySelectorAll('.js-suppressed-content' + (modifier ? modifier : '')).length > 0;
    return suppressedContentExists;
}

/* Returns url */
const url = (contentWrapper) => { 
    let url = new URL(contentWrapper.getAttribute('data-src'));
    return url; 
}

/* Sets local storage */
const setLocalStorage = (contentWrapper) => {
    const contentUrl = url(contentWrapper);

    if (!acceptedSuppliers.includes(contentUrl.host) && contentUrl.host !== "https" && contentUrl.host !== "http") {
        acceptedSuppliers.push(contentUrl.host);
    }
    localStorage.setItem('acceptedSuppliers', JSON.stringify(acceptedSuppliers));
}

/* Reveal function */
const revealContent = (contentWrapper) => {
    const template = contentWrapper.querySelector('template');
    const suppressedContentWrapper = contentWrapper.querySelector('.c-acceptance__content');
    const clone = template.content.cloneNode(true);
    suppressedContentWrapper.appendChild(clone);
    const suppressedContent = template.nextElementSibling;
    contentWrapper.classList.remove('js-suppressed-content');
    contentWrapper.querySelector('.js-suppressed-content-prompt').classList.add('u-display--none');
    suppressedContent.setAttribute('src', suppressedContent.getAttribute('data-src'));
}

/* Loops through an reveal every URL-host matching local storage */
const revealContentLoop = () => {
    hasSuppressedContent() && [...document.querySelectorAll('.js-suppressed-content')]
    .forEach(contentWrapper => {
        if (contentWrapper.classList.contains('js-suppressed-content--none')) {
            const contentUrl = url(contentWrapper);
            if(acceptedSuppliers.includes(contentUrl.host)) {
                revealContent(contentWrapper);
            }  
        }
    }); 
}

const handleEvents = (contentWrapper) => {
    /* Sets local storage  */
    setLocalStorage(contentWrapper);

    /* Modifiers (else equals "no modifier") */
    if (contentWrapper.classList.contains('js-suppressed-content--video')) {
        revealContent(contentWrapper);
    } else {
        revealContentLoop();
    }
}

/* Adds click events for all suppressed content */
const setEvents = () => {
    hasSuppressedContent() && [...document.querySelectorAll('.js-suppressed-content')].forEach(contentWrapper => {
        contentWrapper.querySelector('.js-suppressed-content-description').style.display = "block";
        const buttonEl = contentWrapper.querySelector('[js-suppressed-content-accept]');
        buttonEl.addEventListener('click', () => {
            handleEvents(contentWrapper);
        });  
    });
}

/* Initiate and reveal already accepted */
export default () => addEventListener('DOMContentLoaded', () => {
    if (acceptedSuppliers.length > 0 && hasSuppressedContent() ) {
        /* No modifiers */
        hasSuppressedContent('--none') && [...document.querySelectorAll('.js-suppressed-content--none')].forEach(contentWrapper => {
            const contentUrl = url(contentWrapper);
            if (acceptedSuppliers.includes(contentUrl.host) && contentWrapper.classList.contains('js-suppressed-content--none')) {
                revealContent(contentWrapper);
            }
        })
        /* More modifiers... */
    }
    hasSuppressedContent() && setEvents();
});

