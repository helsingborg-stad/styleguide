
console.log("Start");
import expandSection from './expand-section';
import Filter from './filter';
import Sort from './sort';
import Toggle from './toggle';
import Modal from './modal';
import Notice from './notice';

expandSection();

let SortInstance = new Sort;
let ToggleInstance = new Toggle;
let NoticeInstance = new Notice;
SortInstance.applySort();
ToggleInstance.applyToggle();
NoticeInstance.addEvent();

let filter = new Filter;
let ModalInstance = new Modal;
ModalInstance.enableModals();

console.log(ModalInstance);