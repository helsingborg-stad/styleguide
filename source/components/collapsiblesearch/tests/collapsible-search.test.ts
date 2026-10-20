import userEvent from '@testing-library/user-event';
import { type IComponentData, renderComponent } from '../../../js/helpers/ComponentRenderer';
import CollapsibleSearch, { init } from '../collapsible-search';

// ---------------------------------------------------------------------------
// Test data & helpers
// ---------------------------------------------------------------------------

interface ICollapsibleSearchData extends IComponentData {
	id?: string;
	button?: Record<string, unknown>;
	placeholder?: string;
	inputName?: string;
	inputLabel?: string;
	action?: string;
	method?: string;
	closeLabel?: string;
	isExpanded?: boolean;
	lang?: Record<string, string>;
}

const defaultData: ICollapsibleSearchData = {
	button: {
		text: 'Search',
		size: 'md',
		color: 'default',
		style: 'filled',
		icon: 'search',
	},
	placeholder: 'Search…',
	inputName: 's',
	inputLabel: 'Search',
	action: '',
	method: 'get',
	closeLabel: 'Close search',
	isExpanded: false,
	lang: {},
};

async function renderSearch(partialData: Partial<ICollapsibleSearchData> = {}) {
	const data = { ...defaultData, ...partialData };
	const component = await renderComponent('ComponentLibrary\\Component\\Collapsiblesearch\\Collapsiblesearch', 'collapsiblesearch', data);
	document.body.innerHTML += component.innerHTML;
}

function getRoot(): HTMLElement {
	return document.querySelector<HTMLElement>('[data-js-collapsible-search]')!;
}

function getTrigger(): HTMLButtonElement {
	return document.querySelector<HTMLButtonElement>('[data-js-collapsible-search-trigger]')!;
}

function getPanel(): HTMLFormElement {
	return document.querySelector<HTMLFormElement>('[data-js-collapsible-search] form')!;
}

function getInput(): HTMLInputElement {
	return document.querySelector<HTMLInputElement>('[data-js-collapsible-search-input]')!;
}

function getCloseButton(): HTMLButtonElement {
	return document.querySelector<HTMLButtonElement>('[data-js-collapsible-search-close]')!;
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

describe('collapsible-search: rendering', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	it('renders the root element', async () => {
		await renderSearch();
		expect(getRoot()).not.toBeNull();
	});

	it('renders the trigger button', async () => {
		await renderSearch();
		expect(getTrigger()).not.toBeNull();
	});

	it('renders the search panel', async () => {
		await renderSearch();
		expect(getPanel()).not.toBeNull();
	});

	it('renders the search input', async () => {
		await renderSearch();
		expect(getInput()).not.toBeNull();
	});

	it('renders the close button', async () => {
		await renderSearch();
		expect(getCloseButton()).not.toBeNull();
	});

	it('trigger has aria-expanded="false" by default', async () => {
		await renderSearch();
		expect(getTrigger().getAttribute('aria-expanded')).toBe('false');
	});

	it('panel has aria-hidden="true" by default', async () => {
		await renderSearch();
		expect(getPanel().getAttribute('aria-hidden')).toBe('true');
	});

	it('panel has inert attribute in collapsed state', async () => {
		await renderSearch();
		expect(getPanel().hasAttribute('inert')).toBe(true);
	});

	it('search landmark has an accessible name', async () => {
		await renderSearch({ inputLabel: 'Site search' });
		expect(getPanel().getAttribute('aria-label')).toBe('Site search');
	});

	it('uses a consistently prefixed ID for its related ARIA attributes', async () => {
		await renderSearch();
		const panelId = getPanel().id;

		expect(panelId).toMatch(/^collapsiblesearch-.+-panel$/);
		expect(getTrigger().getAttribute('aria-controls')).toBe(panelId);
		expect(getCloseButton().getAttribute('aria-controls')).toBe(panelId);
		expect(document.querySelector<HTMLLabelElement>('[data-js-collapsible-search] label')?.htmlFor).toBe(getInput().id);
	});

	it('keeps IDs unique across multiple components', async () => {
		await renderSearch();
		await renderSearch();

		const panels = Array.from(document.querySelectorAll<HTMLFormElement>('[data-js-collapsible-search] form'));
		expect(panels.map((panel) => panel.id)).toHaveLength(2);
		expect(new Set(panels.map((panel) => panel.id)).size).toBe(2);
	});

	it('does not double-prefix an explicitly provided ID', async () => {
		await renderSearch({ id: 'collapsiblesearch-site-search' });
		expect(getPanel().id).toBe('collapsiblesearch-site-search-panel');
	});

	it('renders the placeholder text on the input', async () => {
		await renderSearch({ placeholder: 'Find it…' });
		expect(getInput().getAttribute('placeholder')).toBe('Find it…');
	});

	it('renders input name attribute', async () => {
		await renderSearch({ inputName: 'query' });
		expect(getInput().getAttribute('name')).toBe('query');
	});

	it('trigger has aria-expanded="true" when isExpanded', async () => {
		await renderSearch({ isExpanded: true });
		expect(getTrigger().getAttribute('aria-expanded')).toBe('true');
	});

	it('root has expanded modifier class when isExpanded', async () => {
		await renderSearch({ isExpanded: true });
			expect(getRoot().classList.contains('c-collapsiblesearch--expanded')).toBe(true);
	});

	it('panel does not have inert when isExpanded', async () => {
		await renderSearch({ isExpanded: true });
		expect(getPanel().hasAttribute('inert')).toBe(false);
	});
});

// ---------------------------------------------------------------------------
// Behaviour (JS)
// ---------------------------------------------------------------------------

describe('collapsible-search: behaviour', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	async function setup(partialData: Partial<ICollapsibleSearchData> = {}) {
		await renderSearch(partialData);
		const instance = new CollapsibleSearch(getRoot());
		return instance;
	}

	it('opens on trigger click', async () => {
		const instance = await setup();
		await userEvent.click(getTrigger());
		expect(instance.isOpen()).toBe(true);
	});

	it('adds expanded class on open', async () => {
		await setup();
		await userEvent.click(getTrigger());
		expect(getRoot().classList.contains('c-collapsiblesearch--expanded')).toBe(true);
	});

	it('morphs the trigger into a pill on open', async () => {
		await setup();
		await userEvent.click(getTrigger());
		expect(getTrigger().classList.contains('c-button--pill')).toBe(true);
	});

	it('sets aria-expanded="true" on trigger after open', async () => {
		await setup();
		await userEvent.click(getTrigger());
		expect(getTrigger().getAttribute('aria-expanded')).toBe('true');
	});

	it('removes inert from panel on open', async () => {
		await setup();
		await userEvent.click(getTrigger());
		expect(getPanel().hasAttribute('inert')).toBe(false);
	});

	it('suppresses the keyboard focus treatment for automatic input focus', async () => {
		await setup();
		await userEvent.click(getTrigger());
		expect(getRoot().hasAttribute('data-js-collapsible-search-auto-focus')).toBe(true);
	});

	it('closes on close button click', async () => {
		const instance = await setup();
		await userEvent.click(getTrigger());
		await userEvent.click(getCloseButton());
		expect(instance.isOpen()).toBe(false);
	});

	it('removes expanded class on close', async () => {
		await setup();
		await userEvent.click(getTrigger());
		await userEvent.click(getCloseButton());
		expect(getRoot().classList.contains('c-collapsiblesearch--expanded')).toBe(false);
	});

	it('restores the trigger shape on close', async () => {
		await setup();
		await userEvent.click(getTrigger());
		await userEvent.click(getCloseButton());
		expect(getTrigger().classList.contains('c-button--pill')).toBe(false);
	});

	it('sets aria-expanded="false" on trigger after close', async () => {
		await setup();
		await userEvent.click(getTrigger());
		await userEvent.click(getCloseButton());
		expect(getTrigger().getAttribute('aria-expanded')).toBe('false');
	});

	it('restores inert on panel after close', async () => {
		await setup();
		await userEvent.click(getTrigger());
		await userEvent.click(getCloseButton());
		expect(getPanel().hasAttribute('inert')).toBe(true);
	});

	it('closes on Escape keydown', async () => {
		const instance = await setup();
		await userEvent.click(getTrigger());
		await userEvent.keyboard('{Escape}');
		expect(instance.isOpen()).toBe(false);
	});

	it('closes on outside click', async () => {
		const instance = await setup();
		await userEvent.click(getTrigger());
		await userEvent.click(document.body);
		expect(instance.isOpen()).toBe(false);
		expect(document.activeElement).toBe(document.body);
	});

	it('does not close on click inside the component', async () => {
		const instance = await setup();
		await userEvent.click(getTrigger());
		await userEvent.click(getInput());
		expect(instance.isOpen()).toBe(true);
	});

	it('init() function initialises all instances in the DOM', async () => {
		await renderSearch();
		init();
		await userEvent.click(getTrigger());
		expect(getRoot().classList.contains('c-collapsiblesearch--expanded')).toBe(true);
	});
});
