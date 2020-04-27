import './polyfill';

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
import Navbar from './navbar';

expandSection();

<<<<<<< HEAD
let SortInstance = new Sort();
let ToggleInstance = new Toggle();
let SplitButtonInstance = new SplitButton();
let DropdownInstance = new Dropdown();
let SliderInstance = new Slider();
let EventCalendarInstance = new EventCalendar();
let TilesInstance = new Tiles();
const NotificationInstance = new Notification();
const NotificationDocInstance = new NotificationDoc();
let SidebarInstance = new Sidebar();
=======
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
>>>>>>> develop

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

let filter = new Filter();

// Modal
<<<<<<< HEAD
let ModalInstance = new Modal();
ModalInstance.enableModals();

// Steppers
let SteppersInstance = new Steppers();
=======
const ModalInstance = new Modal;
ModalInstance.enableModals();

// Steppers
const SteppersInstance = new Steppers;
>>>>>>> develop
SteppersInstance.enableStepper();

//Menu
let MenuInstance = new Menu();

const FieldsInstance = new Fields();

import './datepicker';

// SCSS/CSS Compiler
new initBuild();
