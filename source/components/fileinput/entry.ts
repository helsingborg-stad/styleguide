import FileInput from '../../js/form/fileInput';
const init = () => new FileInput();
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
