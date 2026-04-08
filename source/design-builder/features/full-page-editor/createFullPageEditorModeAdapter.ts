import type { DesignBuilderModeAdapter } from '../../web-component/designBuilderRootContracts';
import { initializeFullPageEditor } from './initializeFullPageEditor';

export function createFullPageEditorModeAdapter(): DesignBuilderModeAdapter {
	return ({ hostElement, configuration, renderContainer, modeSwitch }) => {
		const runtime = initializeFullPageEditor(configuration.tokenData ?? configuration.tokenLibraryData, renderContainer, hostElement, modeSwitch);

		return {
			dispose: () => {
				runtime?.destroy();
			},
		};
	};
}
