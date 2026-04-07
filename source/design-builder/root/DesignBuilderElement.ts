import { parseDesignBuilderRootConfiguration } from './config';
import {
	createEmptyOverrideState,
	normalizeDesignBuilderOverrideState,
	type DesignBuilderOverrideState,
} from '../services/overrideState';
import {
	DESIGN_BUILDER_MODE_FULL_PAGE,
	type DesignBuilderMode,
	type DesignBuilderModeAdapter,
	type DesignBuilderRootElement,
} from './types';

const ROOT_ELEMENT_TAG_NAME = 'design-builder';
const SHADOW_STYLE_ASSET = '/assets/dist/css/design-builder.css';
const SHADOW_STYLE_ID = 'design-builder-shadow-style';

class DesignBuilderElement extends HTMLElement implements DesignBuilderRootElement {
	public static observedAttributes = [
		'mode',
		'config',
		'token-data',
		'token-library',
		'component-data',
		'override-state',
	];

	private static modeAdapters = new Map<DesignBuilderMode, DesignBuilderModeAdapter>();
	private static hasRegistered = false;

	private currentMode: DesignBuilderMode | null = null;
	private currentConfig: Record<string, unknown> | null = null;
	private currentTokenData: unknown;
	private currentTokenLibraryData: unknown;
	private currentComponentData: unknown;
	private currentOverrideState: DesignBuilderOverrideState = createEmptyOverrideState();
	private hasInitialized = false;
	private styleReady: Promise<void> | null = null;
	private renderPromise: Promise<void> | null = null;
	private hasPendingRender = false;
	private activeDisposer: (() => void | Promise<void>) | null = null;

	public getRenderContainer(): ShadowRoot {
		if (!this.shadowRoot) {
			this.attachShadow({ mode: 'open' });
		}

		return this.shadowRoot as ShadowRoot;
	}

	public get mode(): DesignBuilderMode {
		return this.currentMode ?? DESIGN_BUILDER_MODE_FULL_PAGE;
	}

	public set mode(value: DesignBuilderMode) {
		this.currentMode = value;
		if (this.getAttribute('mode') !== value) {
			this.setAttribute('mode', value);
			return;
		}

		if (this.hasInitialized) {
			void this.scheduleRender();
		}
	}

	public get config(): Record<string, unknown> {
		return this.currentConfig ?? {};
	}

	public set config(value: Record<string, unknown>) {
		this.currentConfig = value;
		if (this.hasInitialized) {
			void this.scheduleRender();
		}
	}

	public get tokenLibraryData(): unknown {
		return this.currentTokenLibraryData;
	}

	public set tokenLibraryData(value: unknown) {
		this.currentTokenLibraryData = value;
		if (this.hasInitialized) {
			void this.scheduleRender();
		}
	}

	public get tokenData(): unknown {
		return this.currentTokenData;
	}

	public set tokenData(value: unknown) {
		this.currentTokenData = value;
		if (this.hasInitialized) {
			void this.scheduleRender();
		}
	}

	public get componentData(): unknown {
		return this.currentComponentData;
	}

	public set componentData(value: unknown) {
		this.currentComponentData = value;
		if (this.hasInitialized) {
			void this.scheduleRender();
		}
	}

	public get overrideState(): DesignBuilderOverrideState {
		return this.currentOverrideState;
	}

	public set overrideState(value: DesignBuilderOverrideState) {
		this.currentOverrideState = normalizeDesignBuilderOverrideState(value);
	}

	public connectedCallback(): void {
		if (!this.hasInitialized) {
			this.hasInitialized = true;
		}

		void this.scheduleRender();
	}

	public disconnectedCallback(): void {
		void this.disposeActiveAdapter();
	}

	public attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
		if (oldValue === newValue) {
			return;
		}

		if (name === 'mode') {
			this.currentMode = newValue ? (newValue as DesignBuilderMode) : null;
		}

		if (!this.hasInitialized) {
			return;
		}

		void this.scheduleRender();
	}

	public switchMode(value: DesignBuilderMode): void {
		if (this.mode === value) {
			return;
		}

		this.mode = value;
	}

	private async scheduleRender(): Promise<void> {
		if (this.renderPromise) {
			this.hasPendingRender = true;
			await this.renderPromise;
			return;
		}

		this.renderPromise = this.renderWithAdapter();

		try {
			await this.renderPromise;
		} finally {
			this.renderPromise = null;
			if (this.hasPendingRender) {
				this.hasPendingRender = false;
				void this.scheduleRender();
			}
		}
	}

	private async renderWithAdapter(): Promise<void> {
		const renderContainer = this.getRenderContainer();
		await this.ensureShadowStyles();
		await this.disposeActiveAdapter();
		this.resetRenderContainer(renderContainer);

		const parsedConfiguration = parseDesignBuilderRootConfiguration({
			hostElement: this,
			propertyConfig: this.currentConfig,
			propertyTokenData: this.currentTokenData,
			propertyTokenLibraryData: this.currentTokenLibraryData,
			propertyComponentData: this.currentComponentData,
			propertyOverrideState: this.currentOverrideState,
		});

		this.currentMode = parsedConfiguration.mode;
		this.currentConfig = parsedConfiguration.config;
		this.currentTokenData = parsedConfiguration.tokenData;
		this.currentTokenLibraryData = parsedConfiguration.tokenLibraryData;
		this.currentComponentData = parsedConfiguration.componentData;
		this.currentOverrideState = parsedConfiguration.overrideState;

		const modeAdapter = DesignBuilderElement.modeAdapters.get(parsedConfiguration.mode);
		if (!modeAdapter) {
			this.dispatchEvent(
				new CustomEvent('design-builder:error', {
					detail: {
						message: `No mode adapter is registered for mode "${parsedConfiguration.mode}".`,
					},
					bubbles: true,
					composed: true,
				}),
			);
			return;
		}

		const modeAdapterResult = await modeAdapter({
			hostElement: this,
			configuration: parsedConfiguration,
			renderContainer,
			modeSwitch: {
				activeMode: parsedConfiguration.mode,
				availableModes: parsedConfiguration.availableModes,
				onSwitch: (mode) => {
					this.switchMode(mode);
				},
			},
		});

		this.activeDisposer = modeAdapterResult?.dispose ?? null;

		this.dispatchEvent(
			new CustomEvent('design-builder:initialized', {
				detail: {
					mode: parsedConfiguration.mode,
					availableModes: parsedConfiguration.availableModes,
				},
				bubbles: true,
				composed: true,
			}),
		);
	}

	private resetRenderContainer(renderContainer: ShadowRoot): void {
		const shadowStyle = renderContainer.querySelector(`#${SHADOW_STYLE_ID}`);
		renderContainer.replaceChildren(...(shadowStyle ? [shadowStyle] : []));
	}

	private async disposeActiveAdapter(): Promise<void> {
		if (!this.activeDisposer) {
			return;
		}

		const disposer = this.activeDisposer;
		this.activeDisposer = null;
		await disposer();
	}

	public static registerModeAdapter(mode: DesignBuilderMode, adapter: DesignBuilderModeAdapter): void {
		DesignBuilderElement.modeAdapters.set(mode, adapter);
	}

	private async ensureShadowStyles(): Promise<void> {
		const shadowRoot = this.shadowRoot;
		if (!shadowRoot) {
			return;
		}

		if (shadowRoot.querySelector(`#${SHADOW_STYLE_ID}`)) {
			return;
		}

		if (this.styleReady) {
			await this.styleReady;
			return;
		}

		this.styleReady = (async () => {
			const style = document.createElement('style');
			style.id = SHADOW_STYLE_ID;
			style.textContent = '';
			shadowRoot.prepend(style);

			try {
				const response = await fetch(SHADOW_STYLE_ASSET, { credentials: 'same-origin' });
				if (!response.ok) {
					throw new Error(`Failed to load design-builder styles (${response.status}).`);
				}
				style.textContent = await response.text();
			} catch (error) {
				this.dispatchEvent(
					new CustomEvent('design-builder:error', {
						detail: {
							message:
								error instanceof Error ? error.message : 'Failed to load encapsulated design-builder stylesheet.',
						},
						bubbles: true,
						composed: true,
					}),
				);
			}
		})();

		await this.styleReady;
	}

	public static define(): void {
		if (DesignBuilderElement.hasRegistered || customElements.get(ROOT_ELEMENT_TAG_NAME)) {
			DesignBuilderElement.hasRegistered = true;
			return;
		}

		customElements.define(ROOT_ELEMENT_TAG_NAME, DesignBuilderElement);
		DesignBuilderElement.hasRegistered = true;
	}
}

export function registerDesignBuilderElement(): void {
	DesignBuilderElement.define();
}

export function registerDesignBuilderModeAdapter(mode: DesignBuilderMode, adapter: DesignBuilderModeAdapter): void {
	DesignBuilderElement.registerModeAdapter(mode, adapter);
}
