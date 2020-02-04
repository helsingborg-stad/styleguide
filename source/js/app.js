import './polyfill';

import expandSection from './expand-section';
import Filter from './filter';
import Sort from './sort';
import Toggle from './toggle';
import Menu from './menu';
import Modal from "./modal";
import Steppers from "./steppers";
import Image from "./image";
import SplitButton from './splitButton';
import Dropdown from './dropdown';
import Fields from './fields';
import Slider from './slider'
import EventCalendar from './calendar';
import Tiles from './tile';
import Notification from './notification';
import NotificationDoc from './notificationDoc';

expandSection();

let SortInstance = new Sort;
let ToggleInstance = new Toggle;
let SplitButtonInstance = new SplitButton;
let DropdownInstance = new Dropdown;
let SliderInstance = new Slider;
let EventCalendarInstance = new EventCalendar;
let TilesInstance = new Tiles;
const NotificationInstance = new Notification;
const NotificationDocInstance = new NotificationDoc;

SortInstance.applySort();
ToggleInstance.applyToggle();
DropdownInstance.setValidTargets();
SplitButtonInstance.syncSplitButton();
SliderInstance.applySliders();
EventCalendarInstance.initiateCalendar();
TilesInstance.initTiles();
NotificationDocInstance.addListener();
NotificationInstance.setup();


let filter = new Filter;

// Modal
let ModalInstance = new Modal;
ModalInstance.enableModals();

// Steppers
let SteppersInstance = new Steppers;
SteppersInstance.enableStepper();

//Menu
let MenuInstance = new Menu;

const FieldsInstance = new Fields;

import './datepicker';