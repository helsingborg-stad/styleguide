
console.log("Start");
import expandSection from './expand-section';
import Filter from './filter';
import Sort from './sort';
import Toggle from './toggle';
import Modal from "./modal";
import Steppers from "./steppers";
import Image from "./image";
import SplitButton from './splitButton';

expandSection();


let SortInstance = new Sort;
let ToggleInstance = new Toggle;
let SplitButtonInstance = new SplitButton;

SortInstance.applySort();
ToggleInstance.applyToggle();
SplitButtonInstance.syncSplitButton();

let filter = new Filter;

// Modal
let ModalInstance = new Modal;
ModalInstance.enableModals();

// Steppers
let SteppersInstance = new Steppers;
SteppersInstance.enableStepper();
