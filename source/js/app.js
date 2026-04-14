import './dropdown';
import AnchorMenu from './anchorMenu';
import ButtonToggleContent from './ButtonToggleContent';
import EventCalendar from './calendar';
import ClassToggleInitializer from './classToggle/classToggleInitializer';
import DynamicSidebar from './dynamicSidebar';
import expandSection from './expand-section';
import { initializeForms } from './fields';
import Filter from './filter';
import Hero from './hero';
import KeepInViewPort from './keepInViewPort';
import Menu from './menu';
import Navbar from './navbar';
import Notification from './notification';
import NotificationDoc from './notificationDoc';
import { initializePagination } from './pagination';
import QuickLinksHeader from './quickLinksHeader';
import ResizeByChildren from './resizeByChildren';
import Sidebar from './sidebar';
import { initializeSlider } from './slider';
import Sort from './sort';
import SplitButton from './splitButton';
import Steppers from './steppers';
import StickyKeys from './stickyKeys';
import setScrollbarCSS from './stretch';
import Tooltip from './tooltip';
import './helpers/swipe';
import { AriaPressedToggler } from './AriaPressedToggler';
import { initializeBrand } from './brand';
import { initializeClickAways } from './ClickAway';
import { initializeCompressed } from './compressed';
import { setupCopy } from './copy';
import { DeviceDetect } from './deviceDetect';
import { initializeDismissableNotices } from './dismissableNotices';
import { initializeDrawerAccessibility } from './drawerAccessibility';
import { initializeExtendedDropdownMenu } from './extendedDropdownMenu';
import FileInput from './form/fileInput';
import { initializeGoogleTranslate } from './googleTranslate';
import { moveElement } from './helpers/moveElement';
import { moveElements } from './helpers/moveElements';
import { initializeIframeAcceptance } from './iframeAcceptance';
import { initializeMegaMenus } from './megaMenu';
import { initializeModal } from './modal';
import { initializeOpenStreetMaps } from './openStreetMap';
import { initializeResizeMediaQuery } from './resizeMediaQuery';
import { SimulateClick } from './SimulateClick';
import { initializeSegments } from './segment';
import { initializeSelectFilter } from './selectFilter';
import { initializeSelectSort } from './selectSort';
import { initializeSizeObserver } from './sizeObserver';
import { initializeTable } from './table';
import { initializeTestimonials } from './testimonials';

// Instances
const DeviceDetectInstance = new DeviceDetect();
const SortInstance = new Sort();
const SplitButtonInstance = new SplitButton();
const EventCalendarInstance = new EventCalendar();
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
	const NotificationInstance = new Notification();
	const DynamicSidebarInstance = new DynamicSidebar();
	const filter = new Filter();
	const MenuInstance = new Menu();
	const fileInput = new FileInput();

	new ClassToggleInitializer().init();
	NotificationInstance.setup();
	SortInstance.applySort();
	SplitButtonInstance.syncSplitButton();
	EventCalendarInstance.initiateCalendar();
	NotificationDocInstance.addListener();
	SidebarInstance.applySidebar();
	DynamicSidebarInstance.applySidebar();
	SteppersInstance.enableStepper();

	// Functions
	initializeResizeMediaQuery();
	initializeOpenStreetMaps();
	initializeDrawerAccessibility();
	initializeForms();
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
	initializeSelectFilter();
	initializeSelectSort();
	initializeMegaMenus();
	initializeExtendedDropdownMenu();
	initializeSizeObserver();
	initializeBrand();
	initializeDismissableNotices();

	// Utility functions
	moveElements(moveElement);
	initializeClickAways();
});
