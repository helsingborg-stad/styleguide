import { initializeMegaMenus } from '../../js/megaMenu';
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializeMegaMenus);
else initializeMegaMenus();
