import { DESIGN_BUILDER_MODE_COMPONENT_CUSTOMIZER, DESIGN_BUILDER_MODE_FULL_PAGE, type DesignBuilderMode, type DesignBuilderRootConfiguration, type DesignBuilderRootElement } from './designBuilderRootContracts';
import { normalizeDesignBuilderOverrideState } from '../shared/state/designBuilderOverrideState';
import { normalizeDesignBuilderProvidedPresets } from '../shared/presets/designBuilderPresetDefinitions';

interface ParseRootConfigurationInput {
	hostElement: DesignBuilderRootElement;
	preferredMode?: DesignBuilderMode | null;
	propertyTokenData: unknown;
	propertyTokenLibraryData: unknown;
	propertyComponentData: unknown;
	propertyOverrideState?: unknown;
	propertyPresets?: unknown;
}

const SHOW_SAVE_BUTTON_ATTRIBUTE = 'show-save-button';
const LEGACY_SHOW_SAVE_BUTTON_ATTRIBUTE = 'data-show-save-button';

function parseJsonUnknown(value: string | null): unknown {
	if (!value) {
		return undefined;
	}

	try {
		return JSON.parse(value);
	} catch {
		return undefined;
	}
}

function resolveMode(raw: unknown): DesignBuilderMode | null {
	if (typeof raw !== 'string') {
		return null;
	}

	const normalizedValue = raw.trim().toLowerCase();
	if (normalizedValue === DESIGN_BUILDER_MODE_FULL_PAGE) {
		return DESIGN_BUILDER_MODE_FULL_PAGE;
	}

	if (normalizedValue === DESIGN_BUILDER_MODE_COMPONENT_CUSTOMIZER) {
		return DESIGN_BUILDER_MODE_COMPONENT_CUSTOMIZER;
	}

	return null;
}

function hasPayload(value: unknown): boolean {
	return value !== undefined && value !== null;
}

function parseBooleanAttribute(value: string | null, fallback: boolean): boolean {
	if (value === null) {
		return fallback;
	}

	const normalizedValue = value.trim().toLowerCase();
	if (normalizedValue === '') {
		return true;
	}

	if (['false', '0', 'no', 'off'].includes(normalizedValue)) {
		return false;
	}

	if (['true', '1', 'yes', 'on'].includes(normalizedValue)) {
		return true;
	}

	return fallback;
}

function resolveAvailableModes(tokenData: unknown, componentData: unknown): DesignBuilderMode[] {
	const availableModes: DesignBuilderMode[] = [];

	if (hasPayload(tokenData)) {
		availableModes.push(DESIGN_BUILDER_MODE_FULL_PAGE);
	}

	if (hasPayload(tokenData) && hasPayload(componentData)) {
		availableModes.push(DESIGN_BUILDER_MODE_COMPONENT_CUSTOMIZER);
	}

	return availableModes;
}

export function resolveDesignBuilderRootConfiguration(input: ParseRootConfigurationInput): DesignBuilderRootConfiguration {
	const { hostElement, preferredMode, propertyTokenData, propertyTokenLibraryData, propertyComponentData, propertyOverrideState, propertyPresets } = input;

	const rootTokenData = propertyTokenData ?? parseJsonUnknown(hostElement.getAttribute('token-data'));
	const legacyTokenLibraryData = propertyTokenLibraryData ?? parseJsonUnknown(hostElement.getAttribute('token-library'));
	const tokenData = rootTokenData ?? legacyTokenLibraryData;
	const tokenLibraryData = legacyTokenLibraryData ?? tokenData;
	const componentData = propertyComponentData ?? parseJsonUnknown(hostElement.getAttribute('component-data'));
	const overrideState = normalizeDesignBuilderOverrideState(propertyOverrideState ?? parseJsonUnknown(hostElement.getAttribute('override-state')));
	const presets = normalizeDesignBuilderProvidedPresets(propertyPresets ?? parseJsonUnknown(hostElement.getAttribute('presets')));
	const requestedMode = preferredMode ?? resolveMode(hostElement.getAttribute('mode'));
	const showSaveButton = parseBooleanAttribute(
		hostElement.getAttribute(SHOW_SAVE_BUTTON_ATTRIBUTE) ?? hostElement.getAttribute(LEGACY_SHOW_SAVE_BUTTON_ATTRIBUTE),
		true,
	);
	const availableModes = resolveAvailableModes(tokenData, componentData);
	const resolvedMode = requestedMode && availableModes.includes(requestedMode)
		? requestedMode
		: hasPayload(componentData) && hasPayload(legacyTokenLibraryData) && !hasPayload(rootTokenData)
			? DESIGN_BUILDER_MODE_COMPONENT_CUSTOMIZER
			: hasPayload(tokenData)
				? DESIGN_BUILDER_MODE_FULL_PAGE
				: availableModes[0] ?? DESIGN_BUILDER_MODE_FULL_PAGE;

	return {
		mode: resolvedMode,
		availableModes,
		tokenData,
		tokenLibraryData,
		componentData,
		overrideState,
		presets,
		showSaveButton,
	};
}
