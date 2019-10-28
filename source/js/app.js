
console.log("Start");
import expandSection from './expand-section';
import Filter from './filter';
import Sort from './sort';
import Toggle from './toggle';
import Modal from './modal'

expandSection();

let SortInstance = new Sort;
let ToggleInstance = new Toggle;
SortInstance.applySort();
ToggleInstance.applyToggle();

let filter = new Filter;

let ModalInstance = new Modal;
ModalInstance.enableModals();

console.log(ModalInstance);