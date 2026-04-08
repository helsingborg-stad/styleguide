import { registerDesignBuilderCustomElement } from '../../web-component/DesignBuilderCustomElement';
import { registerBuiltInDesignBuilderModeAdapters } from '../../web-component/registerBuiltInDesignBuilderModeAdapters';
import { resolveStyleguideDesignBuilderRootElements } from './resolveStyleguideDesignBuilderRootElements';

export function initializeStyleguideDesignBuilder(): void {
	registerBuiltInDesignBuilderModeAdapters();
	resolveStyleguideDesignBuilderRootElements();
	registerDesignBuilderCustomElement();
}
