
const floatField = document.querySelector('.cp-input-text__field');
const floatContainer = document.querySelector('.c-input-text');
const floatLabel = document.querySelector('.c-input-text label');

floatField.addEventListener('focus', () => {
    if (floatContainer) {
        floatContainer.classList.add('active');
    }
});
floatLabel.addEventListener('click', () => {
    if (floatContainer) {
        floatContainer.classList.add('active');
        floatField.focus();
    }
});
floatField.addEventListener('blur', () => {
    if (floatContainer) {
        floatContainer.classList.remove('active');
    }
});