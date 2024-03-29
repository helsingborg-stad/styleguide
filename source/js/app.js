import './dropdown';
import expandSection from './expand-section';
import setScrollbarCSS from './stretch';
import Filter from './filter';
import Sort from './sort';
import ToggleClasses from './toggle';
import Menu from './menu';
import Modal from './modal';
import Steppers from './steppers';
import Image from './image';
import SplitButton from './splitButton';
import {initializeForms} from './fields';
import {initializeSlider} from './slider';
import EventCalendar from './calendar';
import Tiles from './tile';
import Notification from './notification';
import NotificationDoc from './notificationDoc';
import initBuild from '../../build/initBuild';
import Sidebar from './sidebar';
import DynamicSidebar from './dynamicSidebar';
import Navbar from './navbar';
import Table from './table';
import Segment from './segment';
import {initializePagination} from './pagination';
import ResizeByChildren from './resizeByChildren';
import KeepInViewPort from './keepInViewPort';
import ButtonToggleContent from './ButtonToggleContent';
import TestimonialCarousel from './testimonials';
import IframeAcceptance from './iframeAcceptance';
import StickyKeys from './stickyKeys';
import Hero from './hero';
import Tooltip from './tooltip';
import {initializeMenus} from './nav';
import AnchorMenu from './anchorMenu';
import QuickLinksHeader from './quickLinksHeader';
import './helpers/swipe';
import {moveElements} from './helpers/moveElements';
import {moveElement} from './helpers/moveElement';
import {initializeClickAways} from './ClickAway';
import {AriaPressedToggler} from './AriaPressedToggler';
import {SimulateClick} from './SimulateClick';
import {SelectComponentObserver} from './select/SelectComponentObserver'; 
import {initializeOpenStreetMaps} from './openStreetMap';
import {setupCopy} from './copy';
import { initializeCompressed } from './compressed';
import {DeviceDetect} from './deviceDetect';
import {initializeGoogleTranslate} from './googleTranslate';
import {initializeResizeMediaQuery} from './resizeMediaQuery';
import {initializeMaterialSymbols} from './materialSymbols';

expandSection();
setScrollbarCSS();
IframeAcceptance();
AnchorMenu();

const DeviceDetectInstance = new DeviceDetect(); 
const SimulateClickInstance = new SimulateClick();
const StickyKeysInstance = new StickyKeys();
const HeroInstance = new Hero();
const TooltipInstance = new Tooltip();
const SortInstance = new Sort();
const ToggleClassesInstance = new ToggleClasses();
const SplitButtonInstance = new SplitButton();
const EventCalendarInstance = new EventCalendar();
const TilesInstance = new Tiles();
const NotificationInstance = new Notification();
const NotificationDocInstance = new NotificationDoc();
const SidebarInstance = new Sidebar();
const NavbarInstance = new Navbar();
const KeepInViewPortInstance = new KeepInViewPort();
const ResizeByChildrenInstance = new ResizeByChildren();
const AriaPressedTogglerInstance = new AriaPressedToggler();
const QuickLinksHeaderInstance = new QuickLinksHeader();
initializePagination();
initializeMenus();
initializeSlider();
initializeCompressed();
setupCopy();
initializeGoogleTranslate();
initializeMaterialSymbols();

document.addEventListener('DOMContentLoaded', () => {
    const ButtonToggleContentInstance = new ButtonToggleContent();
    const selectComponentObserverInstance = new SelectComponentObserver();
    selectComponentObserverInstance.observe();

    // Functions
    initializeResizeMediaQuery();
    initializeOpenStreetMaps();

    // Dynamic Sidebars
    const DynamicSidebarInstance = new DynamicSidebar();
    DynamicSidebarInstance.applySidebar();

    // Utility functions
    moveElements(moveElement);
    initializeClickAways();
});

const tables = document.querySelectorAll('.c-table');
if (tables.length > 0) {
    for (let table of tables) {
        const TableInstance = new Table(table);
    }
}

const segments = document.querySelectorAll('.c-segment');
if (segments) {
    segments.forEach((segment) => {
        const SegmentInstance = new Segment(segment);
    });
}

const testimonialCarousels = document.querySelectorAll('[js-testimonials--is-carousel]');
if (testimonialCarousels) {
    testimonialCarousels.forEach((testimonial) => {
        const testimonialInstance = new TestimonialCarousel(testimonial);
    });
}

SortInstance.applySort();
ToggleClassesInstance.applyToggle();
SplitButtonInstance.syncSplitButton();
EventCalendarInstance.initiateCalendar();
TilesInstance.initTiles();
NotificationDocInstance.addListener();
NotificationInstance.setup();
SidebarInstance.applySidebar();

const filter = new Filter();

// Initialize the modal instance
const initModal = () => {
    const modalInstance = new Modal();
    modalInstance.enableModals();
};

// Wait for the DOM to be fully loaded before initializing the modal
document.addEventListener('DOMContentLoaded', (event) => {
    // Create a mutation observer to watch for changes to the DOM
    const observer = new MutationObserver((mutationsList, observer) => {
        // Reinitialize the modal instance if there are mutations
        initModal();
    });

    // Configure the observer to watch the body for mutations
    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);

    // Initialize the modal instance
    initModal();
});

// Steppers
const SteppersInstance = new Steppers();
SteppersInstance.enableStepper();

// Menu
const MenuInstance = new Menu();

initializeForms();
