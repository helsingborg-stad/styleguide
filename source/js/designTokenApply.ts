/**
 * Design Token Apply
 *
 * Applies persisted design token overrides only when the host has opted in to
 * localStorage-backed design-builder persistence.
 */

import { isLocalStoragePersistenceEnabled } from '../design-builder/shared/persistence/designBuilderStorageOptIn';
import { TokenOverrideLocalStorageStore } from '../design-builder/shared/persistence/TokenOverrideLocalStorageStore';
import { applyThemeOverridesToPage } from '../design-builder/shared/state/applyDesignBuilderOverridesToPage';

if (isLocalStoragePersistenceEnabled(document.documentElement)) {
	const state = new TokenOverrideLocalStorageStore().loadState();

	for (const [prop, value] of Object.entries(state.token)) {
		document.documentElement.style.setProperty(prop, value);
	}

	applyThemeOverridesToPage(state._dark ?? null, state._contrast ?? null);
}
