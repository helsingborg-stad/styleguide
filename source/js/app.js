import expandSection from './expand-section';
import setScrollbarCSS from './stretch';
import Filter from './filter';
import Sort from './sort';
import Toggle from './toggle';
import Menu from './menu';
import Modal from './modal';
import Steppers from './steppers';
import Image from './image';
import SplitButton from './splitButton';
import Dropdown from './dropdown';
import Fields from './fields';
import Slider from './slider';
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
import ContainerMediaQuery from './mediaQuery';
import Pagination from './pagination';
import ResizeByChildren from './resizeByChildren';
import KeepInViewPort from './keepInViewPort';
import ButtonToggle from './buttonToggle';
import TestimonialCarousel from './testimonials';
import IframeAcceptance from './iframeAcceptance';
import './helpers/swipe';

expandSection();
setScrollbarCSS();
IframeAcceptance();

const SortInstance = new Sort;
const ToggleInstance = new Toggle;
const SplitButtonInstance = new SplitButton;
const DropdownInstance = new Dropdown;
const EventCalendarInstance = new EventCalendar;
const TilesInstance = new Tiles;
const NotificationInstance = new Notification;
const NotificationDocInstance = new NotificationDoc;
const SidebarInstance = new Sidebar;
const NavbarInstance = new Navbar();
const ContainerMediaQueryInstance = new ContainerMediaQuery();
const KeepInViewPortInstance = new KeepInViewPort();
const ResizeByChildrenInstance = new ResizeByChildren();
const ButtonToggleInstance = new ButtonToggle;

const tables = document.querySelectorAll('.c-table');
if (tables.length > 0) {
    for (let table of tables) {
        const TableInstance = new Table(table);
    }
}

const sliders = document.querySelectorAll('.c-slider');
if (sliders) {
    sliders.forEach(slider => {
        const SliderInstance = new Slider(slider);
    });
}

const segments = document.querySelectorAll('.c-segment');
if (segments) {
    segments.forEach(segment => {
        const SegmentInstance = new Segment(segment);
    });
}

const paginations = document.querySelectorAll('[js-pagination-target]');
if (paginations) {
    paginations.forEach((pagination) => {
        const paginationInstance = new Pagination(pagination);
    })
}

const testimonialCarousels = document.querySelectorAll('[js-testimonials--is-carousel]');
if (testimonialCarousels) {
    testimonialCarousels.forEach((testimonial) => {
        const testimonialInstance = new TestimonialCarousel(testimonial);
    })
}

SortInstance.applySort();
ToggleInstance.applyToggle();
DropdownInstance.setValidTargets();
SplitButtonInstance.syncSplitButton();
EventCalendarInstance.initiateCalendar();
TilesInstance.initTiles();
NotificationDocInstance.addListener();
NotificationInstance.setup();
SidebarInstance.applySidebar();


// Dynamic Sidebars
const DynamicSidebarInstance = new DynamicSidebar();
DynamicSidebarInstance.applySidebar();

const filter = new Filter();

// Modal
const ModalInstance = new Modal;
ModalInstance.enableModals();

// Steppers
const SteppersInstance = new Steppers;
SteppersInstance.enableStepper();

// Menu
const MenuInstance = new Menu();

const FieldsInstance = new Fields();



