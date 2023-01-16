let sectionElementPositions = [];
const scrollContainer = document.querySelector('#scroll-spy');
let headerHeight = 0;

const hasAnchorMenu = () => {
    const scrollItems = scrollContainer.querySelectorAll('.c-anchormenu__item');
    if(!scrollContainer || scrollItems.length <= 0) {
        return;
    }

    let sectionElements = [];
    let filteredScrollItems = [...scrollItems].filter(item => {
        if (!item.getAttribute('href') || !item.getAttribute('href').startsWith('#')) {
            return false;
        }
        const element = document.querySelector(item.getAttribute('href'));
        if (element) {
            sectionElements.push(element);
            return true;
        }
        item.remove();
        return false;
    });

    if(sectionElements.length > 0) {
        setListeners(filteredScrollItems, sectionElements);
    }
}

const setListeners = (scrollItems, sectionElements) => {

    if (sectionElements.length > 0) {
        window.addEventListener('resize', debounce(elementPositions, 300, sectionElements));

        let currentScroll = 0;
        window.addEventListener('scroll', () => {
            let scrollTop = window.scrollY;
            if(Math.abs(currentScroll - scrollTop > 10 || currentScroll - scrollTop < -10)) {
                handleScroll(scrollItems);
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

const handleScroll = (scrollItems) => {
    let i = 0;
    sectionElementPositions.forEach(item => {
        if(window.scrollY > (item.position - (headerHeight + 120)) && ((item.position + item.height) - (headerHeight + 120)) > window.scrollY) {
            scrollItems[i].classList.add('is-active');
        } else {
            scrollItems[i].classList.remove('is-active');
        } 
        i++;
    });
}
export default () => { hasAnchorMenu() };