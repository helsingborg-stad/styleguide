import { init } from './collapsible-search';
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
