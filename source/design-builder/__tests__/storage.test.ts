import { LocalStorageAdapter, PresetManager, STORAGE_KEY, PRESETS_KEY, ACTIVE_PRESET_KEY } from '../core/storage';

beforeEach(() => {
	localStorage.clear();
});

describe('LocalStorageAdapter', () => {
	it('loads empty object when nothing stored', () => {
		const adapter = new LocalStorageAdapter();
		expect(adapter.load()).toEqual({});
	});

	it('saves and loads overrides', () => {
		const adapter = new LocalStorageAdapter();
		adapter.save({ '--color--primary': '#ff0000', '--font-size': '16px' });
		expect(adapter.load()).toEqual({ '--color--primary': '#ff0000', '--font-size': '16px' });
	});

	it('filters out empty/null/undefined values on save', () => {
		const adapter = new LocalStorageAdapter();
		adapter.save({ '--color--primary': '#ff0000', '--empty': '', '--null': null as unknown as string });
		expect(adapter.load()).toEqual({ '--color--primary': '#ff0000' });
	});

	it('removes storage key when all values are empty', () => {
		const adapter = new LocalStorageAdapter();
		adapter.save({ '--empty': '' });
		expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
	});

	it('clear removes the storage key', () => {
		const adapter = new LocalStorageAdapter();
		adapter.save({ '--color--primary': '#ff0000' });
		adapter.clear();
		expect(adapter.load()).toEqual({});
		expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
	});

	it('uses custom storage key', () => {
		const adapter = new LocalStorageAdapter('custom-key');
		adapter.save({ '--x': 'val' });
		expect(localStorage.getItem('custom-key')).not.toBeNull();
		expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
	});

	it('returns empty object for corrupted JSON', () => {
		localStorage.setItem(STORAGE_KEY, 'not-json');
		const adapter = new LocalStorageAdapter();
		expect(adapter.load()).toEqual({});
	});
});

describe('PresetManager', () => {
	let pm: PresetManager;

	beforeEach(() => {
		pm = new PresetManager();
	});

	it('returns empty when no presets saved', () => {
		expect(pm.loadAll()).toEqual({});
		expect(pm.names()).toEqual([]);
	});

	it('saves and loads a preset', () => {
		const overrides = { '--color--primary': '#00ff00' };
		pm.save('dark', overrides);
		expect(pm.loadAll()).toEqual({ dark: overrides });
		expect(pm.names()).toEqual(['dark']);
	});

	it('deletes a preset', () => {
		pm.save('dark', { '--x': '1' });
		pm.save('light', { '--y': '2' });
		pm.delete('dark');
		expect(pm.names()).toEqual(['light']);
	});

	it('removes presets key when last preset is deleted', () => {
		pm.save('only', { '--x': '1' });
		pm.delete('only');
		expect(localStorage.getItem(PRESETS_KEY)).toBeNull();
	});

	it('manages active preset', () => {
		expect(pm.getActive()).toBeNull();
		pm.setActive('dark');
		expect(pm.getActive()).toBe('dark');
		pm.clearActive();
		expect(pm.getActive()).toBeNull();
	});

	it('clears active when deleting the active preset', () => {
		pm.save('dark', { '--x': '1' });
		pm.setActive('dark');
		pm.delete('dark');
		expect(pm.getActive()).toBeNull();
	});

	it('does not clear active when deleting a different preset', () => {
		pm.save('dark', { '--x': '1' });
		pm.save('light', { '--y': '2' });
		pm.setActive('dark');
		pm.delete('light');
		expect(pm.getActive()).toBe('dark');
	});

	it('returns sorted names', () => {
		pm.save('zebra', { '--a': '1' });
		pm.save('alpha', { '--b': '2' });
		pm.save('mid', { '--c': '3' });
		expect(pm.names()).toEqual(['alpha', 'mid', 'zebra']);
	});

	it('overwrites existing preset', () => {
		pm.save('dark', { '--x': '1' });
		pm.save('dark', { '--x': '2' });
		expect(pm.loadAll()).toEqual({ dark: { '--x': '2' } });
	});

	it('returns empty object for corrupted JSON', () => {
		localStorage.setItem(PRESETS_KEY, '{bad json');
		expect(pm.loadAll()).toEqual({});
	});
});
