import type { DesignBuilderModeSwitch, DesignBuilderRootElement } from '../../root/types';
import { resolveTokenData } from '../../services/tokenData';
import { initDivider } from '../../dom/initDivider';
import { FullPageDesignBuilderRuntime } from './FullPageDesignBuilderRuntime';

const FULL_PAGE_RUNTIME_MOUNT_ID = 'design-builder-full-page-runtime';

export function initializeFullPageDesignBuilder(
	tokenData: unknown,
	renderContainer: ShadowRoot,
	hostElement: DesignBuilderRootElement,
	modeSwitch?: DesignBuilderModeSwitch,
): FullPageDesignBuilderRuntime | null {
	const mountElement = ensureFullPageRuntimeMount(renderContainer);
	const tokens = resolveTokenData(tokenData);
	if (!tokens) {
		mountElement.textContent = 'Error: Invalid or missing token data.';
		return null;
	}

	const runtime = new FullPageDesignBuilderRuntime(mountElement, tokens, hostElement, modeSwitch);
	initDivider();
	return runtime;
}

function ensureFullPageRuntimeMount(renderContainer: ShadowRoot): HTMLElement {
	const existingMount = renderContainer.querySelector<HTMLElement>(`#${FULL_PAGE_RUNTIME_MOUNT_ID}`);
	if (existingMount) {
		existingMount.innerHTML = '';
		return existingMount;
	}

	const mountElement = document.createElement('div');
	mountElement.id = FULL_PAGE_RUNTIME_MOUNT_ID;
	renderContainer.appendChild(mountElement);
	return mountElement;
}
