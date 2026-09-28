import { init } from './index';
init();
import { initializeSelectFilter } from '../../js/selectFilter';
import { initializeSelectSort } from '../../js/selectSort';
const initFilters = () => { initializeSelectFilter(); initializeSelectSort(); };
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initFilters);
else initFilters();
