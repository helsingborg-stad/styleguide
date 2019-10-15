import toggleClass from './toggle';
import expandSection from './expand-section';
import Filter from './filter';
import Sort from './sort'

toggleClass();
expandSection();

let SortInstance = new Sort;
SortInstance.applySort();

let filter = new Filter;

