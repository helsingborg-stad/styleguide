/**
 * Design Token Apply
 *
 * Applies persisted design token overrides only when the host has opted in to
 * localStorage-backed design-builder persistence.
 */

import { isLocalStoragePersistenceEnabled } from '../design-builder/shared/persistence/designBuilderStorageOptIn';
import { TokenOverrideLocalStorageStore } from '../design-builder/shared/persistence/TokenOverrideLocalStorageStore';

if (isLocalStoragePersistenceEnabled(document.documentElement)) {
	const overrides = new TokenOverrideLocalStorageStore().load();

	for (const [prop, value] of Object.entries(overrides)) {
		document.documentElement.style.setProperty(prop, value);
	}
}
