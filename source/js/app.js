import ButtonToggleContent from './ButtonToggleContent';
import ClassToggleInitializer from './classToggle/classToggleInitializer';
import Notification from './notification';
import setScrollbarCSS from './stretch';
import './helpers/swipe';
import { AriaPressedToggler } from './AriaPressedToggler';
import { initializeClickAways } from './ClickAway';
import { initializeCompressed } from './compressed';
import { initializeGoogleTranslate } from './googleTranslate';
import { moveElement } from './helpers/moveElement';
import { moveElements } from './helpers/moveElements';
import { initializeResizeMediaQuery } from './resizeMediaQuery';
import { SimulateClick } from './SimulateClick';

const NotificationInstance = new Notification();

function loadOptionalFeatures() {
    if (document.querySelector('[data-js-device-detect]')) {
        void import('./deviceDetect').then(({ DeviceDetect }) => new DeviceDetect());
    }
    if (document.querySelector('[js-sort-container]')) {
        void import('./sort').then(({ default: Sort }) => new Sort().applySort());
    }
    if (document.querySelector('[js-split]')) {
        void import('./splitButton').then(({ default: SplitButton }) => new SplitButton().syncSplitButton());
    }
    if (document.querySelector('.notification__button')) {
        void import('./notificationDoc').then(({ default: NotificationDoc }) => new NotificationDoc().addListener());
    }
    if (document.querySelector('.c-sidebar[endpoint-children]')) {
        void import('./dynamicSidebar').then(({ default: DynamicSidebar }) => new DynamicSidebar().applySidebar());
    }
    if (document.querySelector('[js-filter-container]')) {
        void import('./filter').then(({ default: Filter }) => new Filter());
    }
    if (document.querySelector('[data-js-keep-in-viewport], [data-js-keep-in-viewport-after-resize]')) {
        void import('./keepInViewPort').then(({ default: KeepInViewPort }) => new KeepInViewPort());
    }
    if (document.querySelector('[js-resize-by-children]')) {
        void import('./resizeByChildren').then(({ default: ResizeByChildren }) => new ResizeByChildren());
    }
    if (document.querySelector('input[type="checkbox"], input[type="email"], input[type="text"], input[type="date"], input[type="search"], input[type="datetime-local"], input[type="month"], input[type="number"]')) {
        void import('./stickyKeys').then(({ default: StickyKeys }) => new StickyKeys());
    }
    if (document.querySelector('#quicklinks-header.c-header--sticky')) {
        void import('./quickLinksHeader').then(({ default: QuickLinksHeader }) => new QuickLinksHeader());
    }
    if (document.querySelector('[data-js-copy-target]')) {
        void import('./copy').then(({ setupCopy }) => setupCopy());
    }
    if (document.querySelector('[data-js-extended-dropdown-content]')) {
        void import('./extendedDropdownMenu').then(({ initializeExtendedDropdownMenu }) => initializeExtendedDropdownMenu());
    }
    if (document.querySelector('[data-js-sizeobserver]')) {
        void import('./sizeObserver').then(({ initializeSizeObserver }) => initializeSizeObserver());
    }
    if (document.querySelector('#scroll-spy')) {
        void import('./anchorMenu').then(({ default: AnchorMenu }) => AnchorMenu());
    }
    if (document.querySelector('.js-dropdown')) {
        void import('./dropdown');
    }
}

document.addEventListener('DOMContentLoaded', () => {
	// Instances
	new ButtonToggleContent();
	new SimulateClick();
	new AriaPressedToggler();

	new ClassToggleInitializer().init();
	NotificationInstance.setup();

	// Functions
	initializeResizeMediaQuery();
	initializeCompressed();
	initializeGoogleTranslate();
	setScrollbarCSS();

	// Utility functions
	moveElements(moveElement);
	initializeClickAways();
	loadOptionalFeatures();
});
