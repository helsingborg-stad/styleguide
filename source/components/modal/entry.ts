import { initializeModal } from './modal';
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializeModal);
else initializeModal();
