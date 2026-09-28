import { initializeDismissableNotices } from '../../js/dismissableNotices';
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializeDismissableNotices);
else initializeDismissableNotices();
