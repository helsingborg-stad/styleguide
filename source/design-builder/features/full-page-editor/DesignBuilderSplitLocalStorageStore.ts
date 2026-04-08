import { MAX_SPLIT, MIN_SPLIT, SPLIT_STORAGE_KEY } from '../../shared/constants/designBuilderRuntimeConstants';
import { browserLocalStorageAdapter, type DesignBuilderStorageAdapter } from '../../shared/persistence/DesignBuilderStorageAdapter';

export interface DesignBuilderSplitStore {
	load(): number | null;
	save(value: number): void;
}

export class DesignBuilderSplitLocalStorageStore implements DesignBuilderSplitStore {
	private key: string;
	private storage: DesignBuilderStorageAdapter;

	constructor(key: string = SPLIT_STORAGE_KEY, storage: DesignBuilderStorageAdapter = browserLocalStorageAdapter) {
		this.key = key;
		this.storage = storage;
	}

	public load(): number | null {
		const rawValue = this.storage.getItem(this.key);
		if (!rawValue) {
			return null;
		}

		const ratio = parseFloat(rawValue);
		if (!Number.isFinite(ratio) || ratio < MIN_SPLIT || ratio > MAX_SPLIT) {
			return null;
		}

		return ratio;
	}

	public save(value: number): void {
		if (!Number.isFinite(value) || value < MIN_SPLIT || value > MAX_SPLIT) {
			return;
		}

		this.storage.setItem(this.key, value.toString());
	}
}
