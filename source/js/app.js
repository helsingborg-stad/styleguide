import './polyfill';
import '@babel/polyfill'; 

import expandSection from './expand-section';
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
import initBuild from './initBuild';
import Sidebar from './sidebar';
import DynamicSidebar from './dynamicSidebar';
import Navbar from './navbar';
import Table from './table';

expandSection();

const SortInstance = new Sort;
const ToggleInstance = new Toggle;
const SplitButtonInstance = new SplitButton;
const DropdownInstance = new Dropdown;
const SliderInstance = new Slider;
const EventCalendarInstance = new EventCalendar;
const TilesInstance = new Tiles;
const NotificationInstance = new Notification;
const NotificationDocInstance = new NotificationDoc;
const SidebarInstance = new Sidebar;
const NavbarInstance = new Navbar();

const table = document.querySelector('.c-table');
if (table) {
    const TableInstance = new Table(document.querySelector('.c-table'));
}

SortInstance.applySort();
ToggleInstance.applyToggle();
DropdownInstance.setValidTargets();
SplitButtonInstance.syncSplitButton();
SliderInstance.applySliders();
EventCalendarInstance.initiateCalendar();
TilesInstance.initTiles();
NotificationDocInstance.addListener();
NotificationInstance.setup();
SidebarInstance.applySidebar();

// Dynamic Sidebars
const DynamicSidebarInstance = new DynamicSidebar();
DynamicSidebarInstance.applySidebar();

let filter = new Filter();

// Modal
const ModalInstance = new Modal;
ModalInstance.enableModals();

// Steppers
const SteppersInstance = new Steppers;
SteppersInstance.enableStepper();

//Menu
let MenuInstance = new Menu();

const FieldsInstance = new Fields();

import './datepicker';

// SCSS/CSS Compiler
new initBuild();