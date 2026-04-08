export interface DesignBuilderStorageAdapter {
	getItem(key: string): string | null;
	setItem(key: string, value: string): void;
	removeItem(key: string): void;
}

export const browserLocalStorageAdapter: DesignBuilderStorageAdapter = {
	getItem(key) {
		return localStorage.getItem(key);
	},
	setItem(key, value) {
		localStorage.setItem(key, value);
	},
	removeItem(key) {
		localStorage.removeItem(key);
	},
};
