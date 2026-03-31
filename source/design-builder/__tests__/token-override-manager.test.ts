import { TokenOverrideManager } from '../core/token-override-manager';
import type { StorageAdapter } from '../core/storage';

function createMockStorage(initial: Record<string, string> = {}): StorageAdapter {
	let data = { ...initial };
	return {
		load: () => ({ ...data }),
		save: (overrides: Record<string, string>) => { data = { ...overrides }; },
		clear: () => { data = {}; },
	};
}

describe('TokenOverrideManager', () => {
	let target: HTMLElement;

	beforeEach(() => {
		target = document.createElement('div');
	});

	it('loads initial overrides from storage', () => {
		const storage = createMockStorage({ '--x': 'red' });
		const manager = new TokenOverrideManager(storage, target);
		expect(manager.getAll()).toEqual({ '--x': 'red' });
	});

	it('set applies value to target and stores override', () => {
		const storage = createMockStorage();
		const manager = new TokenOverrideManager(storage, target);

		manager.set('--color', 'blue', 'default');
		expect(manager.get('--color')).toBe('blue');
		expect(target.style.getPropertyValue('--color')).toBe('blue');
	});

	it('set removes override when value matches default', () => {
		const storage = createMockStorage({ '--color': 'blue' });
		const manager = new TokenOverrideManager(storage, target);
		target.style.setProperty('--color', 'blue');

		manager.set('--color', 'default', 'default');
		expect(manager.get('--color')).toBeUndefined();
		expect(target.style.getPropertyValue('--color')).toBe('');
	});

	it('set removes override when value is empty', () => {
		const storage = createMockStorage({ '--color': 'blue' });
		const manager = new TokenOverrideManager(storage, target);

		manager.set('--color', '', 'default');
		expect(manager.get('--color')).toBeUndefined();
	});

	it('replaceAll clears old and applies new overrides', () => {
		const storage = createMockStorage({ '--old': 'val' });
		const manager = new TokenOverrideManager(storage, target);
		target.style.setProperty('--old', 'val');

		manager.replaceAll({ '--new': 'newval' });
		expect(target.style.getPropertyValue('--old')).toBe('');
		expect(target.style.getPropertyValue('--new')).toBe('newval');
		expect(manager.getAll()).toEqual({ '--new': 'newval' });
	});

	it('clearAll removes all overrides', () => {
		const storage = createMockStorage({ '--a': '1', '--b': '2' });
		const manager = new TokenOverrideManager(storage, target);
		manager.applyAllToTarget();

		manager.clearAll();
		expect(manager.getAll()).toEqual({});
		expect(target.style.getPropertyValue('--a')).toBe('');
		expect(target.style.getPropertyValue('--b')).toBe('');
	});

	it('removeLockedVariables deletes locked vars and saves', () => {
		const storage = createMockStorage({ '--locked': 'val', '--open': 'val2' });
		const manager = new TokenOverrideManager(storage, target);

		manager.removeLockedVariables(new Set(['--locked']));
		expect(manager.get('--locked')).toBeUndefined();
		expect(manager.get('--open')).toBe('val2');
	});

	it('applyAllToTarget sets all overrides on target', () => {
		const storage = createMockStorage({ '--a': '1', '--b': '2' });
		const manager = new TokenOverrideManager(storage, target);

		manager.applyAllToTarget();
		expect(target.style.getPropertyValue('--a')).toBe('1');
		expect(target.style.getPropertyValue('--b')).toBe('2');
	});

	it('getAll returns a copy, not a reference', () => {
		const storage = createMockStorage({ '--x': '1' });
		const manager = new TokenOverrideManager(storage, target);

		const all = manager.getAll();
		all['--x'] = 'modified';
		expect(manager.get('--x')).toBe('1');
	});
});
