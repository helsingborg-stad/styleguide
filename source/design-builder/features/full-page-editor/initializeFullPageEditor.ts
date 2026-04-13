import { parseDesignTokenLibraryData } from '../../shared/design-tokens/designTokenLibrary';
import type { DesignBuilderModeSwitch, DesignBuilderRootElement } from '../../web-component/designBuilderRootContracts';
import { FullPageEditorRuntime } from './FullPageEditorRuntime';
import { initializePreviewSplitDivider } from './initializePreviewSplitDivider';

const FULL_PAGE_RUNTIME_MOUNT_ID = 'design-builder-full-page-runtime';

export function initializeFullPageEditor(
	tokenData: unknown,
	renderContainer: ShadowRoot,
	hostElement: DesignBuilderRootElement,
	modeSwitch?: DesignBuilderModeSwitch,
	showSaveButton = true,
): FullPageEditorRuntime | null {
	const mountElement = ensureFullPageRuntimeMount(renderContainer);
	const tokens = parseDesignTokenLibraryData(tokenData);
	if (!tokens) {
		mountElement.textContent = 'Error: Invalid or missing token data.';
		return null;
	}

	const runtime = new FullPageEditorRuntime(mountElement, tokens, hostElement, modeSwitch, showSaveButton);
	initializePreviewSplitDivider(undefined, hostElement);
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
