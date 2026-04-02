import {
MAX_SPLIT,
MIN_SPLIT,
SPLIT_STORAGE_KEY,
} from '../state/runtimeConstants';

export function initDivider(): void {
const layout = document.querySelector<HTMLElement>('.db-layout');
const divider = document.querySelector<HTMLElement>('[data-db-divider]');
if (!layout || !divider) return;

const saved = localStorage.getItem(SPLIT_STORAGE_KEY);
if (saved) {
const ratio = parseFloat(saved);
if (ratio >= MIN_SPLIT && ratio <= MAX_SPLIT) {
layout.style.setProperty('--db-split', `${ratio}%`);
}
}

const onPointerMove = (event: PointerEvent) => {
const rect = layout.getBoundingClientRect();
let ratio = ((event.clientX - rect.left) / rect.width) * 100;
ratio = Math.max(MIN_SPLIT, Math.min(MAX_SPLIT, ratio));
layout.style.setProperty('--db-split', `${ratio}%`);
};

const onPointerUp = (event: PointerEvent) => {
divider.classList.remove('is-dragging');
document.body.style.userSelect = '';
document.body.style.cursor = '';
divider.releasePointerCapture(event.pointerId);
divider.removeEventListener('pointermove', onPointerMove);
divider.removeEventListener('pointerup', onPointerUp);

const current = layout.style.getPropertyValue('--db-split');
if (current) {
localStorage.setItem(SPLIT_STORAGE_KEY, parseFloat(current).toString());
}
};

divider.addEventListener('pointerdown', (event: PointerEvent) => {
event.preventDefault();
divider.classList.add('is-dragging');
document.body.style.userSelect = 'none';
document.body.style.cursor = 'col-resize';
divider.setPointerCapture(event.pointerId);
divider.addEventListener('pointermove', onPointerMove);
divider.addEventListener('pointerup', onPointerUp);
});
}
