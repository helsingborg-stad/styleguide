// Main JavaScript entry point - imports all JS/TS files from the styleguide

// Design token overrides (from localStorage)
import './designTokenApply.ts';

// Core functionality
import './app.js';
import './index.js';

// Components - now imported via compatibility index
// Individual component files are now located in: source/components/{name}/{name}.js|ts


// Form components
import './form/checkbox.js';
import './form/collapse.js';
import './form/conditions.js';
import './form/policy.js';

// Objects
import './tooltip/tooltip.ts';
import './popover/popoverInit.ts';

// Utilities (that are not components)
import './AriaPressedToggler.ts';
import './ButtonToggleContent.ts';
import './ClickAway.ts';
import './SimulateClick.ts';
import './compressed.ts';
import './copy.ts';
import './deviceDetect.ts';
import './googleTranslate.ts';
import './sizeObserver.ts';
import './stretch.ts';

// Additional non-component JS files
import './anchorMenu.js';
import './dropdown.ts';
import './dynamicSidebar.js';
import './filter.js';
import './keepInViewPort.js';
import './notification.js';
import './notificationDoc.js';
import './quickLinksHeader.ts';
import './resizeByChildren.js';
import './resizeMediaQuery.ts';
import './selectFilterInterface.ts';
import './sort.js';
import './splitButton.js';
import './stickyKeys.js';
import './datalistAutocomplete.ts';
import './classToggle/classToggle.ts';

// Styleguide-only documentation features
import './doc/modifierPreview.ts';

// Helpers (excluding ComponentRenderer.ts which is for server-side testing)
import './helpers/moveElement.ts';
import './helpers/moveElements.ts';
import './helpers/swipe.js';
import './helpers/video.js';

// All form file input related components
