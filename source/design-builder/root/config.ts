import {
	DESIGN_BUILDER_MODE_COMPONENT_CUSTOMIZER,
	DESIGN_BUILDER_MODE_FULL_PAGE,
	type DesignBuilderMode,
	type DesignBuilderRootConfiguration,
	type DesignBuilderRootElement,
} from './types';

interface ParseRootConfigurationInput {
	hostElement: DesignBuilderRootElement;
	propertyMode: DesignBuilderMode | null;
	propertyConfig: Record<string, unknown> | null;
	propertyTokenData: unknown;
	propertyTokenLibraryData: unknown;
	propertyComponentData: unknown;
}

function parseJsonObject(value: string | null): Record<string, unknown> {
	if (!value) {
		return {};
	}

	try {
		const parsed = JSON.parse(value) as unknown;
		if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
			return {};
		}

		return parsed as Record<string, unknown>;
	} catch {
		return {};
	}
}

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

export function parseDesignBuilderRootConfiguration(
	input: ParseRootConfigurationInput,
): DesignBuilderRootConfiguration {
	const {
		hostElement,
		propertyMode,
		propertyConfig,
		propertyTokenData,
		propertyTokenLibraryData,
		propertyComponentData,
	} = input;

	const configFromAttribute = parseJsonObject(hostElement.getAttribute('config'));
	const modeFromConfig = resolveMode(configFromAttribute.mode);
	const modeFromAttribute = resolveMode(hostElement.getAttribute('mode'));
	const resolvedMode = propertyMode ?? modeFromAttribute ?? modeFromConfig ?? DESIGN_BUILDER_MODE_FULL_PAGE;

	const config = {
		...configFromAttribute,
		...(propertyConfig ?? {}),
	};

	const tokenData = propertyTokenData ?? parseJsonUnknown(hostElement.getAttribute('token-data'));
	const tokenLibraryData = propertyTokenLibraryData ?? parseJsonUnknown(hostElement.getAttribute('token-library'));

	const componentData = propertyComponentData ?? parseJsonUnknown(hostElement.getAttribute('component-data'));

	return {
		mode: resolvedMode,
		config,
		tokenData,
		tokenLibraryData,
		componentData,
	};
}
