import { parseDesignBuilderRootConfiguration } from './config';
import {
DESIGN_BUILDER_MODE_FULL_PAGE,
type DesignBuilderMode,
type DesignBuilderModeAdapter,
type DesignBuilderRootElement,
} from './types';

const ROOT_ELEMENT_TAG_NAME = 'design-builder';

class DesignBuilderElement extends HTMLElement implements DesignBuilderRootElement {
	public static observedAttributes = ['mode', 'config', 'token-data', 'token-library', 'component-data'];

private static modeAdapters = new Map<DesignBuilderMode, DesignBuilderModeAdapter>();
private static hasRegistered = false;

	private currentMode: DesignBuilderMode | null = null;
	private currentConfig: Record<string, unknown> | null = null;
	private currentTokenData: unknown;
	private currentTokenLibraryData: unknown;
	private currentComponentData: unknown;
	private hasInitialized = false;

	public get mode(): DesignBuilderMode {
		return this.currentMode ?? DESIGN_BUILDER_MODE_FULL_PAGE;
	}

	public set mode(value: DesignBuilderMode) {
		this.currentMode = value;
	}

	public get config(): Record<string, unknown> {
		return this.currentConfig ?? {};
	}

	public set config(value: Record<string, unknown>) {
		this.currentConfig = value;
}

	public get tokenLibraryData(): unknown {
		return this.currentTokenLibraryData;
	}

	public set tokenLibraryData(value: unknown) {
		this.currentTokenLibraryData = value;
	}

	public get tokenData(): unknown {
		return this.currentTokenData;
	}

	public set tokenData(value: unknown) {
		this.currentTokenData = value;
	}

public get componentData(): unknown {
return this.currentComponentData;
}

public set componentData(value: unknown) {
this.currentComponentData = value;
}

public connectedCallback(): void {
if (this.hasInitialized) {
return;
}

this.hasInitialized = true;
void this.initializeWithAdapter();
}

public attributeChangedCallback(): void {
if (this.hasInitialized) {
return;
}
}

private async initializeWithAdapter(): Promise<void> {
const parsedConfiguration = parseDesignBuilderRootConfiguration({
			hostElement: this,
			propertyMode: this.currentMode,
			propertyConfig: this.currentConfig,
			propertyTokenData: this.currentTokenData,
			propertyTokenLibraryData: this.currentTokenLibraryData,
			propertyComponentData: this.currentComponentData,
		});

		this.currentMode = parsedConfiguration.mode;
		this.currentConfig = parsedConfiguration.config;
		this.currentTokenData = parsedConfiguration.tokenData;
		this.currentTokenLibraryData = parsedConfiguration.tokenLibraryData;
		this.currentComponentData = parsedConfiguration.componentData;

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

await modeAdapter({
hostElement: this,
configuration: parsedConfiguration,
});

this.dispatchEvent(
new CustomEvent('design-builder:initialized', {
detail: {
mode: parsedConfiguration.mode,
},
bubbles: true,
composed: true,
}),
);
}

	public static registerModeAdapter(mode: DesignBuilderMode, adapter: DesignBuilderModeAdapter): void {
		DesignBuilderElement.modeAdapters.set(mode, adapter);
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
