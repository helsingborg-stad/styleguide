const scrollContainer = document.querySelector('#scroll-spy');
let sectionElementPositions = [];
let headerHeight = 0;

const handleAnchorMenu = () => {
    const scrollItems = scrollContainer.querySelectorAll('.c-anchormenu__item');
    if(!scrollContainer || scrollItems.length <= 0) {
        return;
    }

    const menuElements = [...scrollItems].filter((item) => 
    document.querySelector(item.getAttribute('href')) ? item : item.remove());

    const sectionElements = [...scrollItems].map((item) => 
    document.querySelector(item.getAttribute('href'))).filter(element => element); 

    sectionElements.length > 0 && setListeners(menuElements, sectionElements);
}

const setListeners = (menuElements, sectionElements) => {
    if (sectionElements.length > 0) {
        window.addEventListener('resize', debounce(elementPositions, 300, sectionElements));

        let currentScroll = 0;
        window.addEventListener('scroll', () => {
            let scrollTop = window.scrollY;
            if(Math.abs(currentScroll - scrollTop > 10 || currentScroll - scrollTop < -10)) {
                handleScroll(menuElements);
                currentScroll = scrollTop;
            }
        });

    }
}

const debounce = (func, delay, sectionElements) => {
    let timer;

    func(sectionElements);

    return () => {
        timer ? clearTimeout(timer) : (() => {})();
        timer = setTimeout(() => {
            func(sectionElements);
        }, delay);
    }
}

const elementPositions = (sectionElements) => {
    const header = document.querySelector('#site-header');
    if(header && header.classList.contains('c-header--sticky')) {
        headerHeight = header.offsetHeight;
        scrollContainer.style.top = header.offsetHeight + 'px';
    }
    const arr = sectionElements.map(function (sectionElement) {
        return ({"position": window.scrollY + sectionElement.getBoundingClientRect().top, "height": sectionElement.getBoundingClientRect().height});
    });
    sectionElementPositions = arr;
}

const handleScroll = (menuElements) => {
    let i = 0;
    sectionElementPositions.forEach(item => {
        if(window.scrollY > (item.position - (headerHeight + 120)) && ((item.position + item.height) - (headerHeight + 120)) > window.scrollY) {
            menuElements[i].classList.add('is-active');
        } else {
            menuElements[i].classList.remove('is-active');
        } 
        i++;
    });
}
export default () => { handleAnchorMenu() };