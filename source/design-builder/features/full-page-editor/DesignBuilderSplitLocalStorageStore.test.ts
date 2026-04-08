import { DesignBuilderSplitLocalStorageStore } from './DesignBuilderSplitLocalStorageStore';
import { SPLIT_STORAGE_KEY } from '../../shared/constants/designBuilderRuntimeConstants';
import type { DesignBuilderStorageAdapter } from '../../shared/persistence/DesignBuilderStorageAdapter';

function createMemoryStorage(initialState: Record<string, string> = {}): DesignBuilderStorageAdapter {
	const storage = new Map(Object.entries(initialState));

	return {
		getItem(key) {
			return storage.get(key) ?? null;
		},
		setItem(key, value) {
			storage.set(key, value);
		},
		removeItem(key) {
			storage.delete(key);
		},
	};
}

describe('DesignBuilderSplitLocalStorageStore', () => {
	it('supports injected storage adapters', () => {
		const storage = createMemoryStorage();
		const store = new DesignBuilderSplitLocalStorageStore(SPLIT_STORAGE_KEY, storage);

		store.save(42);

		expect(store.load()).toBe(42);
		expect(storage.getItem(SPLIT_STORAGE_KEY)).toBe('42');
	});
});
