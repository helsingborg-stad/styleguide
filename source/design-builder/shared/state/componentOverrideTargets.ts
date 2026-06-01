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
	const overlayElement = element.nextElementSibling;
	if (overlayElement instanceof HTMLElement && overlayElement.classList.contains('drawer-overlay')) {
		targets.push(overlayElement);
	}

	return targets;
}
