import expandSection from './expand-section';
import Filter from './filter';
import Sort from './sort';
import Toggle from './toggle';

expandSection();

let SortInstance = new Sort;
let ToggleInstance = new Toggle;
SortInstance.applySort();
ToggleInstance.applyToggle();

let filter = new Filter;

