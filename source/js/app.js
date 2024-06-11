import './dropdown';
import expandSection from './expand-section';
import setScrollbarCSS from './stretch';
import Filter from './filter';
import Sort from './sort';
import ToggleClasses from './toggle';
import Menu from './menu';
import Steppers from './steppers';
import SplitButton from './splitButton';
import {initializeForms} from './fields';
import {initializeSlider} from './slider';
import EventCalendar from './calendar';
import Tiles from './tile';
import Notification from './notification';
import NotificationDoc from './notificationDoc';
import Sidebar from './sidebar';
import DynamicSidebar from './dynamicSidebar';
import Navbar from './navbar';
import {initializePagination} from './pagination';
import ResizeByChildren from './resizeByChildren';
import KeepInViewPort from './keepInViewPort';
import ButtonToggleContent from './ButtonToggleContent';
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
import {initializeCompressed} from './compressed';
import {DeviceDetect} from './deviceDetect';
import {initializeGoogleTranslate} from './googleTranslate';
import {initializeResizeMediaQuery} from './resizeMediaQuery';
import {initializeDrawerAccessibility} from './drawerAccessibility';
import {initializeTestimonials} from './testimonials';
import {initializeSegments} from './segment';
import {initializeTable} from './table';
import {initializeModal} from './modal';
import {initializeIframeAcceptance} from './iframeAcceptance';

// Instances
const DeviceDetectInstance = new DeviceDetect(); 
const SortInstance = new Sort();
const SplitButtonInstance = new SplitButton();
const EventCalendarInstance = new EventCalendar();
const TilesInstance = new Tiles();
const NotificationDocInstance = new NotificationDoc();
const SidebarInstance = new Sidebar();
const SteppersInstance = new Steppers();

document.addEventListener('DOMContentLoaded', () => {
    // Needs to run early
    initializePagination();

    // Instances
    const ButtonToggleContentInstance = new ButtonToggleContent();
    const SimulateClickInstance = new SimulateClick();
    const StickyKeysInstance = new StickyKeys();
    const HeroInstance = new Hero();
    const TooltipInstance = new Tooltip();
    const KeepInViewPortInstance = new KeepInViewPort();
    const ResizeByChildrenInstance = new ResizeByChildren();
    const AriaPressedTogglerInstance = new AriaPressedToggler();
    const QuickLinksHeaderInstance = new QuickLinksHeader();
    const NavbarInstance = new Navbar();
    const selectComponentObserverInstance = new SelectComponentObserver();
    const ToggleClassesInstance = new ToggleClasses();
    const NotificationInstance = new Notification();
    const DynamicSidebarInstance = new DynamicSidebar();
    const filter = new Filter();
    const MenuInstance = new Menu();

    selectComponentObserverInstance.observe();
    ToggleClassesInstance.applyToggle();
    NotificationInstance.setup();
    SortInstance.applySort();
    SplitButtonInstance.syncSplitButton();
    EventCalendarInstance.initiateCalendar();
    TilesInstance.initTiles();
    NotificationDocInstance.addListener();
    SidebarInstance.applySidebar();
    DynamicSidebarInstance.applySidebar();
    SteppersInstance.enableStepper();

    // Functions
    initializeResizeMediaQuery();
    initializeOpenStreetMaps();
    initializeDrawerAccessibility();
    initializeForms();
    initializeMenus();
    initializeSlider();
    initializeCompressed();
    initializeGoogleTranslate();
    initializeTestimonials();
    initializeSegments();
    initializeTable();
    initializeModal();
    initializeIframeAcceptance();
    expandSection();
    setupCopy();
    setScrollbarCSS();
    AnchorMenu();

    // Utility functions
    moveElements(moveElement);
    initializeClickAways();
});