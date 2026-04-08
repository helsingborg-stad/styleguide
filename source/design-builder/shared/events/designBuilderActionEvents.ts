import type { DesignBuilderOverrideState } from '../state/designBuilderOverrideState';
import type { DesignBuilderMode, DesignBuilderRootElement } from '../../web-component/designBuilderRootContracts';

export const DESIGN_BUILDER_ACTION_EVENT = 'design-builder:action';

export type DesignBuilderActionType =
	| 'change'
	| 'save'
	| 'reset-all'
	| 'reset-component'
	| 'import'
	| 'export'
	| 'preset-save'
	| 'preset-load'
	| 'preset-delete'
	| 'mode-change'
	| 'split-change';

export interface DesignBuilderActionEventDetail {
	action: DesignBuilderActionType;
	mode: DesignBuilderMode;
	state: DesignBuilderOverrideState;
	metadata?: Record<string, unknown>;
}

function createActionEvent(eventName: string, detail: DesignBuilderActionEventDetail): CustomEvent<DesignBuilderActionEventDetail> {
	return new CustomEvent(eventName, {
		detail,
		bubbles: true,
		composed: true,
	});
}

export function emitDesignBuilderActionEvent(
	hostElement: DesignBuilderRootElement,
	detail: DesignBuilderActionEventDetail,
): void {
	hostElement.dispatchEvent(createActionEvent(DESIGN_BUILDER_ACTION_EVENT, detail));
	hostElement.dispatchEvent(createActionEvent(`design-builder:${detail.action}`, detail));
}
