import { LocalStorageAdapter } from '../../storage';
import { resolveTokenData } from '../../services/tokenData';
import { initDivider } from '../../dom/initDivider';
import { FullPageDesignBuilderRuntime } from './FullPageDesignBuilderRuntime';

export function initializeFullPageDesignBuilder(tokenData: unknown, renderContainer: ShadowRoot): void {
	const tokens = resolveTokenData(tokenData);
	if (!tokens) {
		renderContainer.textContent = 'Error: Invalid or missing token data.';
		return;
	}

	const storage = new LocalStorageAdapter();
	new FullPageDesignBuilderRuntime(renderContainer, tokens, storage);
	initDivider();
}
