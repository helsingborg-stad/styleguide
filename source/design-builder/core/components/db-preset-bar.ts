import type { PresetManager } from '../storage';

/**
 * Preset bar web component — renders a list of preset chips
 * with load-on-click and delete functionality.
 *
 * Dispatches:
 * - `db-preset-load` (detail: { name: string })
 * - `db-preset-delete` (detail: { name: string })
 */
export class DbPresetBar extends HTMLElement {
	private presetManager!: PresetManager;

	configure(presetManager: PresetManager): void {
		this.presetManager = presetManager;
		this.refresh();
	}

	refresh(): void {
		this.innerHTML = '';
		this.className = 'db-presets';

		const names = this.presetManager.names();
		if (names.length === 0) {
			this.hidden = true;
			this.classList.add('u-display--none');
			return;
		}

		this.hidden = false;
		this.classList.remove('u-display--none');

		const list = document.createElement('div');
		list.className = 'db-presets__list';

		const activeName = this.presetManager.getActive();

		for (const name of names) {
			list.appendChild(this.createChip(name, name === activeName));
		}

		this.appendChild(list);
	}

	private createChip(name: string, isActive: boolean): HTMLElement {
		const chip = document.createElement('button');
		chip.type = 'button';
		chip.className = 'db-presets__chip';
		if (isActive) chip.classList.add('db-presets__chip--active');

		const label = document.createElement('span');
		label.className = 'db-presets__chip-label';
		label.textContent = name;
		chip.appendChild(label);

		const del = document.createElement('span');
		del.className = 'db-presets__chip-delete';
		del.textContent = '\u00d7';
		del.title = `Delete "${name}"`;
		del.addEventListener('click', (e) => {
			e.stopPropagation();
			this.dispatchEvent(new CustomEvent('db-preset-delete', { detail: { name } }));
		});
		chip.appendChild(del);

		chip.addEventListener('click', () => {
			this.dispatchEvent(new CustomEvent('db-preset-load', { detail: { name } }));
		});

		return chip;
	}
}

customElements.define('db-preset-bar', DbPresetBar);
