import { normalizeDesignBuilderOverrideState } from '../../shared/state/designBuilderOverrideState';
import type { ComponentTokenData, TokenData } from '../../shared/types/designBuilderDataTypes';
import type { DesignBuilderRootElement } from '../../web-component/designBuilderRootContracts';
import { ComponentCustomizerRuntime } from './ComponentCustomizerRuntime';

describe('component palette change notifications', () => {
	it.each(['base', 'dark', 'contrast'] as const)('notifies the document immediately when changing the footer palette in %s', (mode) => {
		const host = document.createElement('div') as unknown as DesignBuilderRootElement;
		host.colorScheme = mode;
		host.overrideState = normalizeDesignBuilderOverrideState({ token: {}, component: {}, _dark: {}, _contrast: {} });
		const root = host.attachShadow({ mode: 'open' });
		document.body.append(host);
		const footer = document.createElement('footer');
		footer.dataset.component = 'footer';
		document.body.append(footer);
		const componentData: ComponentTokenData = { footer: { name: 'Footer', tokens: ['color--surface', 'color--surface-contrast'], componentSettings: [{ id: 'colors', label: 'Colors', settings: [{ token: 'color--surface', label: 'Color Scheme', includeStateColors: false }] }] } };
		const tokenLibrary: TokenData = {
			name: 'Colors',
			version: '1',
			categories: [
				{
					id: 'colors-brand',
					label: 'Colors',
					settings: [
						{ variable: '--color--primary', label: 'Primary', type: 'color', default: '#111111', contrast: '--color--primary-contrast' },
						{ variable: '--color--primary-contrast', label: 'Primary contrast', type: 'color', default: '#ffffff' },
						{ variable: '--color--secondary', label: 'Secondary', type: 'color', default: '#222222', contrast: '--color--secondary-contrast' },
						{ variable: '--color--secondary-contrast', label: 'Secondary contrast', type: 'color', default: '#ffffff' },
						{ variable: '--color--surface', label: 'Surface', type: 'color', default: '#ffffff', contrast: '--color--surface-contrast' },
						{ variable: '--color--surface-contrast', label: 'Surface contrast', type: 'color', default: '#000000' },
					],
				},
			],
		};
		const send = jest.fn();
		document.addEventListener('design-builder:action', send);
		const runtime = new ComponentCustomizerRuntime(componentData, tokenLibrary, root, { hostElement: host });
		try {
			const swatch = root.querySelectorAll<HTMLButtonElement>('[role="option"]')[1];
			expect(swatch).toBeDefined();
			swatch!.click();
			expect(footer.style.getPropertyValue('--c-footer--color--surface')).toBe('var(--color--secondary)');
			expect(send).toHaveBeenCalledTimes(1);
			expect(send.mock.calls[0][0].detail.action).toBe('change');
		} finally {
			runtime.dispose();
			document.removeEventListener('design-builder:action', send);
			document.body.replaceChildren();
		}
	});
});
import '../../shared/control-elements/controls/SwatchSelectControl';
