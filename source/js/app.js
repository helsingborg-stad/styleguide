import './dropdown';
import AnchorMenu from './anchorMenu';
import ButtonToggleContent from './ButtonToggleContent';
import ClassToggleInitializer from './classToggle/classToggleInitializer';
import DynamicSidebar from './dynamicSidebar';
import Filter from './filter';
import KeepInViewPort from './keepInViewPort';
import Notification from './notification';
import NotificationDoc from './notificationDoc';
import QuickLinksHeader from './quickLinksHeader';
import ResizeByChildren from './resizeByChildren';
import Sort from './sort';
import SplitButton from './splitButton';
import StickyKeys from './stickyKeys';
import setScrollbarCSS from './stretch';
import './helpers/swipe';
import { AriaPressedToggler } from './AriaPressedToggler';
import { initializeClickAways } from './ClickAway';
import { initializeCompressed } from './compressed';
import { setupCopy } from './copy';
import { DeviceDetect } from './deviceDetect';
import { initializeExtendedDropdownMenu } from './extendedDropdownMenu';
import { initializeGoogleTranslate } from './googleTranslate';
import { moveElement } from './helpers/moveElement';
import { moveElements } from './helpers/moveElements';
import { initializeResizeMediaQuery } from './resizeMediaQuery';
import { SimulateClick } from './SimulateClick';
import { initializeSizeObserver } from './sizeObserver';

// Instances
new DeviceDetect();
const SortInstance = new Sort();
const SplitButtonInstance = new SplitButton();
const NotificationDocInstance = new NotificationDoc();
const NotificationInstance = new Notification();
const DynamicSidebarInstance = new DynamicSidebar();

document.addEventListener('DOMContentLoaded', () => {
	// Instances
	new ButtonToggleContent();
	new SimulateClick();
	new StickyKeys();
	new KeepInViewPort();
	new ResizeByChildren();
	new AriaPressedToggler();
	new QuickLinksHeader();
	new Notification();
	new DynamicSidebar();
	new Filter();

	new ClassToggleInitializer().init();
	NotificationInstance.setup();
	SortInstance.applySort();
	SplitButtonInstance.syncSplitButton();
	NotificationDocInstance.addListener();
	DynamicSidebarInstance.applySidebar();

	// Functions
	initializeResizeMediaQuery();
	initializeCompressed();
	initializeGoogleTranslate();
	setupCopy();
	setScrollbarCSS();
	AnchorMenu();
	initializeExtendedDropdownMenu();
	initializeSizeObserver();

	// Utility functions
	moveElements(moveElement);
	initializeClickAways();
});
