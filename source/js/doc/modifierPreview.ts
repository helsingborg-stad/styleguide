class ModifierPreview {
    constructor(
        private readonly el: HTMLElement,
        private readonly format: string,
        private readonly selects: HTMLSelectElement[],
        private readonly previewEl: HTMLElement,
        private readonly outputEl: HTMLElement | null,
        private readonly baseClass: string,
    ) {}

    private composeClass(values: Record<string, string>): string {
        let cls = this.format.replace(/^\./, '');
        for (const [key, value] of Object.entries(values)) {
            cls = cls.split(`{${key}}`).join(value);
        }
        return cls;
    }

    private update(): void {
        const values: Record<string, string> = {};
        for (const select of this.selects) {
            const key = select.dataset.modifierKey;
            if (key) {
                values[key] = select.value;
            }
        }

        const cls = this.composeClass(values);
        this.previewEl.className = [this.baseClass, cls].filter(Boolean).join(' ');
        this.previewEl.setAttribute('style', 'outline: 2px dashed currentColor; outline-offset: 4px; min-height: 5rem;');

        if (this.outputEl) {
            this.outputEl.textContent = cls ? `.${cls}` : '';
        }
    }

    public init(): void {
        for (const select of this.selects) {
            select.addEventListener('change', () => this.update());
        }
        this.update();
    }
}

export function initModifierPreviews(): void {
    document.querySelectorAll<HTMLElement>('[data-modifier-preview]').forEach((el) => {
        const format = el.dataset.format;
        if (!format) return;

        const selects = Array.from(el.querySelectorAll<HTMLSelectElement>('select[data-modifier-key]'));
        const previewEl = el.querySelector<HTMLElement>('[data-preview-element]');
        const outputEl = el.querySelector<HTMLElement>('[data-applied-class]');

        if (!previewEl) return;

        const baseClass = previewEl.dataset.baseClass ?? '';

        new ModifierPreview(el, format, selects, previewEl, outputEl, baseClass).init();
    });
}

document.addEventListener('DOMContentLoaded', initModifierPreviews);
