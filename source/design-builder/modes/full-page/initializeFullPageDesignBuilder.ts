import { LocalStorageAdapter } from '../../storage';
import { resolveTokenData } from '../../services/tokenData';
import { initDivider } from '../../dom/initDivider';
import { FullPageDesignBuilderRuntime } from './FullPageDesignBuilderRuntime';

export function initializeFullPageDesignBuilder(hostElement: HTMLElement, tokenData: unknown): void {
const tokens = resolveTokenData(tokenData);
if (!tokens) {
hostElement.textContent = 'Error: Invalid or missing token data.';
return;
}

const storage = new LocalStorageAdapter();
new FullPageDesignBuilderRuntime(hostElement, tokens, storage);
initDivider();
}
