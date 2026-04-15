import { emitDesignBuilderActionEvent } from '../shared/events/designBuilderActionEvents';
import { type DesignBuilderOverrideState, normalizeDesignBuilderOverrideState } from '../shared/state/designBuilderOverrideState';
import { designBuilderStyles } from '../shared/styling/designBuilderStyleText';
import { DESIGN_BUILDER_MODE_FULL_PAGE, type DesignBuilderMode, type DesignBuilderModeAdapter, type DesignBuilderRootElement } from './designBuilderRootContracts';
import { resolveDesignBuilderRootConfiguration } from './resolveDesignBuilderRootConfiguration';

const ROOT_ELEMENT_TAG_NAME = 'design-builder';
const SHADOW_STYLE_ID = 'design-builder-shadow-style';

class DesignBuilderCustomElement extends HTMLElement implements DesignBuilderRootElement {
	public static observedAttributes = ['mode', 'token-data', 'token-library', 'component-data', 'override-state', 'presets', 'show-save-button', 'data-show-save-button'];

	private static modeAdapters = new Map<DesignBuilderMode, DesignBuilderModeAdapter>();
	private static hasRegistered = false;

	private currentMode: DesignBuilderMode | null = null;
	private currentTokenData: unknown;
	private currentTokenLibraryData: unknown;
	private currentComponentData: unknown;
	private currentOverrideState?: DesignBuilderOverrideState;
	private currentPresets: DesignBuilderRootElement['presets'] | undefined = undefined;
	private hasInitialized = false;
	private renderPromise: Promise<void> | null = null;
	private hasPendingRender = false;
	private activeDisposer: (() => void | Promise<void>) | null = null;

	public getRenderContainer(): ShadowRoot {
		if (!this.shadowRoot) {
			this.attachShadow({ mode: 'open' });
		}

		return this.shadowRoot as ShadowRoot;
	}

	private get mode(): DesignBuilderMode {
		return this.currentMode ?? DESIGN_BUILDER_MODE_FULL_PAGE;
	}

	public get tokenLibraryData(): unknown {
		return this.currentTokenLibraryData ?? this.currentTokenData;
	}

	public set tokenLibraryData(value: unknown) {
		this.currentTokenLibraryData = value;
		if (!this.hasAttribute('token-data')) {
			this.currentTokenData = value;
		}
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
		return normalizeDesignBuilderOverrideState(this.currentOverrideState);
	}

	public set overrideState(value: DesignBuilderOverrideState) {
		this.currentOverrideState = normalizeDesignBuilderOverrideState(value);
	}

	public get presets(): DesignBuilderRootElement['presets'] {
		return this.currentPresets ?? [];
	}

	public set presets(value: DesignBuilderRootElement['presets']) {
		this.currentPresets = Array.isArray(value) ? value : [];
		if (this.hasInitialized) {
			void this.scheduleRender();
		}
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

		if (name === 'token-data') {
			this.currentTokenData = undefined;
		}

		if (name === 'mode') {
			this.currentMode = null;
		}

		if (name === 'token-library') {
			this.currentTokenLibraryData = undefined;
			if (!this.hasAttribute('token-data')) {
				this.currentTokenData = undefined;
			}
		}

		if (name === 'component-data') {
			this.currentComponentData = undefined;
		}

		if (name === 'override-state') {
			this.currentOverrideState = undefined;
		}

		if (name === 'presets') {
			this.currentPresets = undefined;
		}

		if (!this.hasInitialized) {
			return;
		}

		void name;
		void this.scheduleRender();
	}

	private switchMode(value: DesignBuilderMode): void {
		if (this.mode === value) {
			return;
		}

		const previousMode = this.mode;
		this.currentMode = value;
		if (this.hasInitialized) {
			emitDesignBuilderActionEvent(this, {
				action: 'mode-change',
				mode: value,
				state: this.overrideState,
				metadata: {
					fromMode: previousMode,
					toMode: value,
				},
			});
			void this.scheduleRender();
		}
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
		this.ensureShadowStyles();
		await this.disposeActiveAdapter();
		this.resetRenderContainer(renderContainer);

		const parsedConfiguration = resolveDesignBuilderRootConfiguration({
			hostElement: this,
			preferredMode: this.currentMode,
			propertyTokenData: this.currentTokenData,
			propertyTokenLibraryData: this.currentTokenLibraryData,
			propertyComponentData: this.currentComponentData,
			propertyOverrideState: this.currentOverrideState,
			propertyPresets: this.currentPresets,
		});

		this.currentMode = parsedConfiguration.mode;
		this.currentTokenData = parsedConfiguration.tokenData;
		this.currentTokenLibraryData = parsedConfiguration.tokenLibraryData;
		this.currentComponentData = parsedConfiguration.componentData;
		this.currentOverrideState = parsedConfiguration.overrideState;
		this.currentPresets = parsedConfiguration.presets;

		const modeAdapter = DesignBuilderCustomElement.modeAdapters.get(parsedConfiguration.mode);
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
		DesignBuilderCustomElement.modeAdapters.set(mode, adapter);
	}

	private ensureShadowStyles(): void {
		const shadowRoot = this.shadowRoot;
		if (!shadowRoot) {
			return;
		}

		if (shadowRoot.querySelector(`#${SHADOW_STYLE_ID}`)) {
			return;
		}

		const style = document.createElement('style');
		style.id = SHADOW_STYLE_ID;
		style.textContent = designBuilderStyles;
		shadowRoot.prepend(style);
	}

	public static define(): void {
		if (DesignBuilderCustomElement.hasRegistered || customElements.get(ROOT_ELEMENT_TAG_NAME)) {
			DesignBuilderCustomElement.hasRegistered = true;
			return;
		}

		customElements.define(ROOT_ELEMENT_TAG_NAME, DesignBuilderCustomElement);
		DesignBuilderCustomElement.hasRegistered = true;
	}
}

export function registerDesignBuilderCustomElement(): void {
	DesignBuilderCustomElement.define();
}

export function registerDesignBuilderModeAdapter(mode: DesignBuilderMode, adapter: DesignBuilderModeAdapter): void {
	DesignBuilderCustomElement.registerModeAdapter(mode, adapter);
}
