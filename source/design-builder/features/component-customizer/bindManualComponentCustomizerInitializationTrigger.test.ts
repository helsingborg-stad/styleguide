import { bindManualComponentCustomizerInitializationTrigger } from './bindManualComponentCustomizerInitializationTrigger';

describe('bindManualComponentCustomizerInitializationTrigger', () => {
	beforeEach(() => {
		document.body.innerHTML = '';
	});

	it('binds initialization to the nested FAB toggle trigger instead of the whole container', () => {
		document.body.innerHTML = `
			<div data-customize-init-fab="true">
				<div class="c-fab__panel">
					<button type="button" data-panel-action="pick-on-page">Pick on page</button>
				</div>
				<button type="button" data-js-toggle-trigger="customizer-panel">Open component customizer</button>
			</div>
		`;

		const initializer = jest.fn<Promise<void>, []>().mockResolvedValue(undefined);
		const unbind = bindManualComponentCustomizerInitializationTrigger(initializer);
		const fabRoot = document.querySelector<HTMLElement>('[data-customize-init-fab="true"]');
		const panelButton = document.querySelector<HTMLElement>('[data-panel-action="pick-on-page"]');
		const fabTrigger = document.querySelector<HTMLElement>('[data-js-toggle-trigger="customizer-panel"]');

		fabRoot?.click();
		panelButton?.click();
		expect(initializer).not.toHaveBeenCalled();

		fabTrigger?.click();
		expect(initializer).toHaveBeenCalledTimes(1);

		unbind();
		fabTrigger?.click();
		expect(initializer).toHaveBeenCalledTimes(1);
	});

	it('falls back to initializing when no manual trigger exists on the page', () => {
		const initializer = jest.fn<Promise<void>, []>().mockResolvedValue(undefined);

		bindManualComponentCustomizerInitializationTrigger(initializer);

		expect(initializer).toHaveBeenCalledTimes(1);
	});
});
