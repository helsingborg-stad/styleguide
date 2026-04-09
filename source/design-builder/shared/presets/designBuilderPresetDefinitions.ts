import { type DesignBuilderOverrideState, normalizeComponentOverrides, normalizeDesignBuilderOverrideState, normalizeTokenOverrides } from '../state/designBuilderOverrideState';
import type { ScopedComponentOverrides } from '../types/designBuilderDataTypes';

export interface DesignBuilderPresetTargets {
	token: boolean;
	component: boolean;
}

export interface DesignBuilderProvidedPreset {
	id: string;
	label: string;
	state: DesignBuilderOverrideState;
	targets: DesignBuilderPresetTargets;
}

function hasStringValue(value: unknown): value is string {
	return typeof value === 'string' && value.trim() !== '';
}

function createPresetTargets(input: Partial<DesignBuilderPresetTargets>): DesignBuilderPresetTargets {
	return {
		token: input.token === true,
		component: input.component === true,
	};
}

function inferPresetTargets(input: unknown): DesignBuilderPresetTargets {
	if (!input || typeof input !== 'object' || Array.isArray(input)) {
		return createPresetTargets({});
	}

	const record = input as Record<string, unknown>;
	if ('token' in record || 'component' in record) {
		return createPresetTargets({
			token: 'token' in record,
			component: 'component' in record,
		});
	}

	const normalizedTokens = normalizeTokenOverrides(record);
	if (Object.keys(normalizedTokens).length === Object.keys(record).length) {
		return createPresetTargets({ token: true });
	}

	const normalizedComponents = normalizeComponentOverrides(record);
	return createPresetTargets({
		component: Object.keys(normalizedComponents).length > 0,
	});
}

function normalizePresetDefinition(input: unknown, fallbackId?: string): DesignBuilderProvidedPreset | null {
	if (!input || typeof input !== 'object' || Array.isArray(input)) {
		return null;
	}

	const record = input as Record<string, unknown>;
	const rawState =
		record.state ??
		record.overrides ??
		('token' in record || 'component' in record
			? {
					...('token' in record ? { token: record.token } : {}),
					...('component' in record ? { component: record.component } : {}),
				}
			: undefined);
	const id = hasStringValue(record.id) ? record.id.trim() : fallbackId?.trim();
	const label = hasStringValue(record.label) ? record.label.trim() : hasStringValue(record.name) ? record.name.trim() : (id ?? fallbackId?.trim());

	if (!id || !label || !rawState) {
		return null;
	}

	return {
		id,
		label,
		state: normalizeDesignBuilderOverrideState(rawState),
		targets: inferPresetTargets(rawState),
	};
}

function areStringMapsEqual(left: Record<string, string>, right: Record<string, string>): boolean {
	const leftKeys = Object.keys(left).sort();
	const rightKeys = Object.keys(right).sort();
	if (leftKeys.length !== rightKeys.length) {
		return false;
	}

	return leftKeys.every((key, index) => key === rightKeys[index] && left[key] === right[key]);
}

function areScopedComponentOverridesEqual(left: ScopedComponentOverrides, right: ScopedComponentOverrides): boolean {
	const leftScopeKeys = Object.keys(left).sort();
	const rightScopeKeys = Object.keys(right).sort();
	if (leftScopeKeys.length !== rightScopeKeys.length) {
		return false;
	}

	return leftScopeKeys.every((scopeKey, index) => {
		if (scopeKey !== rightScopeKeys[index]) {
			return false;
		}

		const leftScope = left[scopeKey] || {};
		const rightScope = right[scopeKey] || {};
		const leftComponentKeys = Object.keys(leftScope).sort();
		const rightComponentKeys = Object.keys(rightScope).sort();
		if (leftComponentKeys.length !== rightComponentKeys.length) {
			return false;
		}

		return leftComponentKeys.every((componentName, componentIndex) => {
			if (componentName !== rightComponentKeys[componentIndex]) {
				return false;
			}

			return areStringMapsEqual(leftScope[componentName] || {}, rightScope[componentName] || {});
		});
	});
}

export function normalizeDesignBuilderProvidedPresets(input: unknown): DesignBuilderProvidedPreset[] {
	if (Array.isArray(input)) {
		return input.map((preset, index) => normalizePresetDefinition(preset, `preset-${index + 1}`)).filter((preset): preset is DesignBuilderProvidedPreset => preset !== null);
	}

	if (!input || typeof input !== 'object') {
		return [];
	}

	return Object.entries(input as Record<string, unknown>)
		.map(([name, preset]) => normalizePresetDefinition(preset, name))
		.filter((preset): preset is DesignBuilderProvidedPreset => preset !== null);
}

export function designBuilderPresetMatchesState(preset: DesignBuilderProvidedPreset, state: DesignBuilderOverrideState): boolean {
	const normalizedState = normalizeDesignBuilderOverrideState(state);

	if (preset.targets.token && !areStringMapsEqual(preset.state.token, normalizedState.token)) {
		return false;
	}

	if (preset.targets.component && !areScopedComponentOverridesEqual(preset.state.component, normalizedState.component)) {
		return false;
	}

	return preset.targets.token || preset.targets.component;
}
