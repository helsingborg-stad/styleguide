// Main JavaScript entry point - imports all JS/TS files from the styleguide

// Design token overrides (from localStorage)
import './designTokenApply.ts';

// Core functionality
import './app.js';
import './index.js';

// Components - now imported via compatibility index
// Individual component files are now located in: source/components/{name}/{name}.js|ts
import './index.ts';

// Form components
import './form/checkbox.js';
import './form/collapse.js';
import './form/conditions.js';
import './form/fileInput.ts';
import './form/policy.js';

// Utilities (that are not components)
import './AriaPressedToggler.ts';
import './ButtonToggleContent.ts';
import './ClickAway.ts';
import './SimulateClick.ts';
import './compressed.ts';
import './copy.ts';
import './deviceDetect.ts';
import './dismissableNotices.ts';
import './drawerAccessibility.ts';
import './googleTranslate.ts';
import './sizeObserver.ts';
import './stretch.ts';

// Additional non-component JS files
import './anchorMenu.js';
import './dropdown.ts';
import './dynamicSidebar.js';
import './expand-section.js';
import './fields.js';
import './filter.js';
import './iframeAcceptance.js';
import './keepInViewPort.js';
import './megaMenu.ts';
import './notification.js';
import './notificationDoc.js';
import './quickLinksHeader.ts';
import './resizeByChildren.js';
import './resizeMediaQuery.ts';
import './selectFilter.ts';
import './selectFilterInterface.ts';
import './selectSort.ts';
import './sort.js';
import './splitButton.js';
import './steppers.js';
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
import './form/fileinput/controller.ts';
import './form/fileinput/dropzone.ts';
import './form/fileinput/fileCounter.ts';
import './form/fileinput/filePreview.ts';
import './form/fileinput/hasMaxFiles.ts';
import './form/fileinput/isEmpty.ts';
import './form/fileinput/maxFileSize.ts';
import './form/fileinput/notice.ts';
import './form/fileinput/UI/fileInputButtonHandler.ts';
import './form/fileinput/UI/fileList.ts';
import './form/fileinput/UI/helper/fileIdCreator.ts';
import './form/fileinput/UI/helper/fileNameFormatter.ts';
import './form/fileinput/UI/helper/fileSizeFormatter.ts';
import './form/fileinput/UI/preview/filePreviewCardRenderer.ts';
import './form/fileinput/UI/preview/filePreviewFactory.ts';
import './form/fileinput/UI/preview/filePreviewListRenderer.ts';
import './form/fileinput/UI/preview/previewCreator.ts';
