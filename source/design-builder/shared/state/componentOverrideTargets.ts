import { normalizeComponentName } from '../../features/component-customizer/componentTokenDefinitions';

/**
 * Returns all DOM elements that should receive local component override variables.
 */
export function getComponentOverrideTargets(element: HTMLElement, componentName: string): HTMLElement[] {
	const normalizedComponentName = normalizeComponentName(componentName);
	if (normalizedComponentName !== 'drawer') {
		return [element];
	}

	const targets = [element];
	const popover = element.parentElement;
	if (popover?.hasAttribute('popover')) {
		targets.push(popover);
	}

	return targets;
}
