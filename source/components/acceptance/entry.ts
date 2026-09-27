import { initializeIframeAcceptance } from '../../js/iframeAcceptance';
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializeIframeAcceptance);
else initializeIframeAcceptance();
