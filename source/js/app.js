import toggleClass from './toggle';
import expandSection from './expand-section';
import Sort from './sort'

toggleClass();
expandSection();
let SortInstance = new Sort;
SortInstance.applySort();
