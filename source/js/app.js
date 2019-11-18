
import "core-js";

import expandSection from './expand-section';
import Filter from './filter';
import Sort from './sort';
import Toggle from './toggle';
import Menu from './menu';
import Modal from "./modal";
import Steppers from "./steppers";
import Image from "./image";

expandSection();


let SortInstance = new Sort;
let ToggleInstance = new Toggle;

SortInstance.applySort();
ToggleInstance.applyToggle();

let filter = new Filter;

// Modal
let ModalInstance = new Modal;
ModalInstance.enableModals();

// Steppers
let SteppersInstance = new Steppers;
SteppersInstance.enableStepper();

//Menu
let MenuInstance = new Menu
MenuInstance.applyMenu();