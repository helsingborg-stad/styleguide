/**
 * Design Builder — Entry Point
 *
 * Detects the active mode (full-page or component-level) and
 * initializes the appropriate tool.
 */

import { LocalStorageAdapter } from './core/storage';
import { DesignBuilder } from './design-builder';
import { ComponentCustomizationTool } from './component-customization-tool';
import { normalizeComponentName } from './core/component-discovery';
import type { TokenData, ComponentTokenData } from './core/types';

// Re-export for tests and external consumers
export { normalizeComponentName } from './core/component-discovery';
export { ComponentOverrideManager as ComponentStorageAdapter } from './core/component-override-manager';

declare global {
	interface Window {
		styleguideCustomizeData?: unknown;
		styleguideDesignTokenLibrary?: unknown;
		styleguideCustomizeInitMode?: unknown;
	}
}

const CUSTOMIZE_INIT_MODE_ONLOAD = 'onload';
const CUSTOMIZE_INIT_MODE_MANUAL = 'manual';
const CUSTOMIZE_MANUAL_TRIGGER_SELECTOR = '[data-customize-init-fab]';

type CustomizeInitMode = typeof CUSTOMIZE_INIT_MODE_ONLOAD | typeof CUSTOMIZE_INIT_MODE_MANUAL;

export function parseComponentTokenData(raw: unknown): ComponentTokenData {
	if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
		return {};
	}

	const parsed: ComponentTokenData = {};
	for (const [key, value] of Object.entries(raw)) {
		const normalizedKey = normalizeComponentName(key);
		if (!normalizedKey) continue;
		if (!value || typeof value !== 'object' || Array.isArray(value)) continue;

		const definition = value as Record<string, unknown>;
		parsed[normalizedKey] = {
			name: typeof definition.name === 'string' ? definition.name : undefined,
			slug: typeof definition.slug === 'string' ? normalizeComponentName(definition.slug) : normalizedKey,
			tokens: Array.isArray(definition.tokens)
				? definition.tokens.filter((token): token is string => typeof token === 'string')
				: [],
		};
	}

	return parsed;
}

export function isTokenData(value: unknown): value is TokenData {
	if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
	return Array.isArray((value as { categories?: unknown }).categories);
}

function loadTokenLibrary(): TokenData | null {
	const embedded = window.styleguideDesignTokenLibrary;
	return isTokenData(embedded) ? embedded : null;
}

function resolveCustomizeInitMode(): CustomizeInitMode {
	const rawMode =
		typeof window.styleguideCustomizeInitMode === 'string'
			? window.styleguideCustomizeInitMode.toLowerCase().trim()
			: '';
	return rawMode === CUSTOMIZE_INIT_MODE_MANUAL ? CUSTOMIZE_INIT_MODE_MANUAL : CUSTOMIZE_INIT_MODE_ONLOAD;
}

// --- Draggable Divider ---

const SPLIT_STORAGE_KEY = 'design-builder-split';
const MIN_SPLIT = 20;
const MAX_SPLIT = 80;

function initDivider(): void {
	const layout = document.querySelector<HTMLElement>('.db-layout');
	const divider = document.querySelector<HTMLElement>('[data-db-divider]');
	if (!layout || !divider) return;

	const saved = localStorage.getItem(SPLIT_STORAGE_KEY);
	if (saved) {
		const ratio = parseFloat(saved);
		if (ratio >= MIN_SPLIT && ratio <= MAX_SPLIT) {
			layout.style.setProperty('--db-split', `${ratio}%`);
		}
	}

	const onPointerMove = (e: PointerEvent) => {
		const rect = layout.getBoundingClientRect();
		let ratio = ((e.clientX - rect.left) / rect.width) * 100;
		ratio = Math.max(MIN_SPLIT, Math.min(MAX_SPLIT, ratio));
		layout.style.setProperty('--db-split', `${ratio}%`);
	};

	const onPointerUp = (e: PointerEvent) => {
		divider.classList.remove('is-dragging');
		document.body.style.userSelect = '';
		document.body.style.cursor = '';
		divider.releasePointerCapture(e.pointerId);
		divider.removeEventListener('pointermove', onPointerMove);
		divider.removeEventListener('pointerup', onPointerUp);

		const current = layout.style.getPropertyValue('--db-split');
		if (current) {
			localStorage.setItem(SPLIT_STORAGE_KEY, parseFloat(current).toString());
		}
	};

	divider.addEventListener('pointerdown', (e: PointerEvent) => {
		e.preventDefault();
		divider.classList.add('is-dragging');
		document.body.style.userSelect = 'none';
		document.body.style.cursor = 'col-resize';
		divider.setPointerCapture(e.pointerId);
		divider.addEventListener('pointermove', onPointerMove);
		divider.addEventListener('pointerup', onPointerUp);
	});
}

// --- Init ---

let hasInitializedComponentCustomization = false;

function initializeDesignBuilderContainer(): boolean {
	const container = document.querySelector<HTMLElement>('[data-design-builder]');
	if (!container) return false;

	const tokensAttr = container.getAttribute('data-tokens');
	if (!tokensAttr) {
		container.textContent = 'Error: No token data found.';
		return true;
	}

	let tokens: TokenData;
	try {
		tokens = JSON.parse(tokensAttr);
	} catch {
		container.textContent = 'Error: Invalid token data.';
		return true;
	}

	new DesignBuilder(container, tokens, new LocalStorageAdapter());
	initDivider();
	return true;
}

async function initializeComponentCustomizationTool(): Promise<void> {
	if (hasInitializedComponentCustomization) return;

	const customizeData = parseComponentTokenData(window.styleguideCustomizeData);
	if (Object.keys(customizeData).length === 0) return;

	const tokenLibrary = loadTokenLibrary();
	if (!tokenLibrary) return;

	new ComponentCustomizationTool(customizeData, tokenLibrary);
	hasInitializedComponentCustomization = true;
}

function openComponentCustomizationPanel(): void {
	const panelRoot = document.querySelector<HTMLElement>('.db-component-tool');
	panelRoot?.classList.add('db-component-tool--open');
}

function bindManualCustomizationInitTrigger(): void {
	const triggers = document.querySelectorAll<HTMLElement>(CUSTOMIZE_MANUAL_TRIGGER_SELECTOR);
	if (triggers.length === 0) {
		void initializeComponentCustomizationTool();
		return;
	}

	for (const trigger of triggers) {
		trigger.addEventListener('click', async () => {
			await initializeComponentCustomizationTool();
			openComponentCustomizationPanel();
		});
	}
}

async function init(): Promise<void> {
	if (initializeDesignBuilderContainer()) return;

	if (resolveCustomizeInitMode() === CUSTOMIZE_INIT_MODE_MANUAL) {
		bindManualCustomizationInitTrigger();
		return;
	}

	await initializeComponentCustomizationTool();
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => void init());
} else {
	void init();
}
