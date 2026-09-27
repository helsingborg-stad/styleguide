import { initializeDrawerAccessibility } from '../../js/drawerAccessibility';
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializeDrawerAccessibility);
else initializeDrawerAccessibility();
