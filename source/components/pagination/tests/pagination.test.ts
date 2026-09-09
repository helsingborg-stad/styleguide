import PaginationFactory from '../script/paginationFactory';

interface PaginationMarkupOptions {
	withSort?: boolean;
	keepDom?: boolean;
	asyncItems?: boolean;
	asyncItemsOnPagination?: boolean;
	perPage?: number;
	pagesToShow?: number;
	items?: Array<{ title: string; label: string }>;
}

function createPaginationMarkup(options: PaginationMarkupOptions = {}): HTMLElement {
	const {
		withSort = false,
		keepDom = false,
		asyncItems = false,
		asyncItemsOnPagination = false,
		perPage = 1,
		pagesToShow = 4,
		items = [
			{ title: '8', label: 'Item 8' },
			{ title: '9', label: 'Item 9' },
			{ title: '3', label: 'Item 3' },
			{ title: '4', label: 'Item 4' },
			{ title: '5', label: 'Item 5' },
			{ title: '1', label: 'Item 1' },
			{ title: '2', label: 'Item 2' },
			{ title: '6', label: 'Item 6' },
			{ title: '7', label: 'Item 7' },
		],
	} = options;

	const sortMarkup = withSort
		? `
		<div data-js-pagination-sort>
			<select>
				<option value="default">Default</option>
				<option value="alphabetical">Alphabetical</option>
				<option value="random">Random</option>
			</select>
		</div>
	`
		: '';

	const listMarkup = items
		.map(
			(item) => `<div data-js-pagination-item data-js-pagination-item-title="${item.title}">${item.label}</div>`,
		)
		.join('');

	document.body.innerHTML = `
		<div data-js-pagination-target ${asyncItems ? 'data-js-pagination-async' : ''}>
			${sortMarkup}
			<div data-js-pagination-container>${listMarkup}</div>
			<nav data-js-pagination data-js-pagination-per-page="${perPage}" data-js-pagination-pages-to-show="${pagesToShow}" ${keepDom ? 'data-js-pagination-keep-dom' : ''} ${asyncItemsOnPagination ? 'data-js-pagination-async' : ''}>
				<button data-js-pagination-prev>Previous</button>
				<div js-table-pagination--links>
					<a data-js-pagination-index>
						<span class="c-button c-button__filled--default"><span class="c-button__label-text">1</span></span>
					</a>
				</div>
				<button data-js-pagination-next>Next</button>
			</nav>
		</div>
	`;

	return document.querySelector('[data-js-pagination-target]') as HTMLElement;
}

function readVisibleItemLabels(): string[] {
	return [...document.querySelectorAll('[data-js-pagination-container] [data-js-pagination-item]')]
		.filter((item) => !(item as HTMLElement).classList.contains('u-display--none'))
		.map((item) => item.textContent?.trim() ?? '');
}

function queryByPage(pageNumber: number): HTMLElement {
	return document.querySelector(`[data-js-pagination-index="${pageNumber}"]`) as HTMLElement;
}

function createPaginationInstance(container: HTMLElement) {
	return new PaginationFactory().create(container, 1);
}

function waitForMutationObserverTick(): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(() => resolve(), 0);
	});
}

describe('Pagination', () => {
	let pushStateSpy: jest.SpyInstance;
	let replaceStateSpy: jest.SpyInstance;

	beforeEach(() => {
		window.history.pushState({}, '', '/components/pagination');
		pushStateSpy = jest.spyOn(window.history, 'pushState');
		replaceStateSpy = jest.spyOn(window.history, 'replaceState');
		jest.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
	});

	afterEach(() => {
		pushStateSpy.mockRestore();
		replaceStateSpy.mockRestore();
		jest.restoreAllMocks();
		document.body.innerHTML = '';
	});

	it('renders the first page on initialization and disables previous button', () => {
		const container = createPaginationMarkup();

		createPaginationInstance(container);

		expect(readVisibleItemLabels()).toEqual(['Item 8']);
		expect((document.querySelector('[data-js-pagination-prev]') as HTMLButtonElement).hasAttribute('disabled')).toBe(true);
		expect((document.querySelector('[data-js-pagination-next]') as HTMLButtonElement).hasAttribute('disabled')).toBe(false);
	});

	it('moves to selected page and updates URL when page link is clicked', () => {
		const container = createPaginationMarkup();

		createPaginationInstance(container);
		queryByPage(3).click();

		expect(readVisibleItemLabels()).toEqual(['Item 3']);
		expect(pushStateSpy).toHaveBeenCalled();
		expect(window.location.search).toContain('pagenum=3');
	});

	it('moves with next and previous buttons and toggles disabled states at boundaries', () => {
		const container = createPaginationMarkup({
			items: [
				{ title: '1', label: 'Item 1' },
				{ title: '2', label: 'Item 2' },
			],
		});

		createPaginationInstance(container);

		const nextButton = document.querySelector('[data-js-pagination-next]') as HTMLButtonElement;
		const previousButton = document.querySelector('[data-js-pagination-prev]') as HTMLButtonElement;

		nextButton.click();

		expect(readVisibleItemLabels()).toEqual(['Item 2']);
		expect(previousButton.hasAttribute('disabled')).toBe(false);
		expect(nextButton.hasAttribute('disabled')).toBe(true);

		previousButton.click();

		expect(readVisibleItemLabels()).toEqual(['Item 1']);
		expect(previousButton.hasAttribute('disabled')).toBe(true);
		expect(nextButton.hasAttribute('disabled')).toBe(false);
	});

	it('respects pagesToShow when generating page links', () => {
		const container = createPaginationMarkup({ pagesToShow: 4 });

		createPaginationInstance(container);

		const pageLinks = [...document.querySelectorAll('[data-js-pagination-index]')]
			.map((element) => element.getAttribute('data-js-pagination-index'))
			.filter((value): value is string => value !== null);

		expect(pageLinks).toEqual(['1', '2', '3', '4', '5']);
	});

	it('sorts alphabetically and resets to page 1 on sort change', () => {
		const container = createPaginationMarkup({ withSort: true });

		createPaginationInstance(container);
		queryByPage(4).click();

		const sortSelect = document.querySelector('[data-js-pagination-sort] select') as HTMLSelectElement;
		sortSelect.value = 'alphabetical';
		sortSelect.dispatchEvent(new Event('change'));

		expect(readVisibleItemLabels()).toEqual(['Item 1']);
		expect(window.location.search).toContain('sortby=alphabetical');
		expect(window.location.search).toContain('pagenum=1');
		expect(replaceStateSpy).toHaveBeenCalled();
	});

	it('does not push a new URL entry on popstate handling', () => {
		const container = createPaginationMarkup();

		createPaginationInstance(container);
		queryByPage(3).click();
		pushStateSpy.mockClear();

		window.history.pushState({}, '', '/components/pagination?pagenum=2');
		pushStateSpy.mockClear();
		window.dispatchEvent(new PopStateEvent('popstate'));

		expect(readVisibleItemLabels()).toEqual(['Item 9']);
		expect(pushStateSpy).not.toHaveBeenCalled();
	});

	it('keeps DOM children and toggles hidden class in keepDOM mode', () => {
		const container = createPaginationMarkup({ keepDom: true });

		createPaginationInstance(container);
		queryByPage(2).click();

		const allItems = [...document.querySelectorAll('[data-js-pagination-container] [data-js-pagination-item]')] as HTMLElement[];
		expect(allItems).toHaveLength(9);
		expect(readVisibleItemLabels()).toEqual(['Item 9']);
		expect(allItems.some((item) => item.classList.contains('u-display--none'))).toBe(true);
	});

	it('does not create a pagination instance when required markup is missing', () => {
		document.body.innerHTML = '<div data-js-pagination-target><div data-js-pagination-container></div></div>';
		const container = document.querySelector('[data-js-pagination-target]') as HTMLElement;

		expect(createPaginationInstance(container)).toBeNull();
	});

	it('updates pages for asynchronously rendered items when async attribute is present', async () => {
		const container = createPaginationMarkup({ items: [], asyncItems: true });

		createPaginationInstance(container);

		const listContainer = document.querySelector('[data-js-pagination-container]') as HTMLElement;
		listContainer.insertAdjacentHTML('beforeend', '<div data-js-pagination-item data-js-pagination-item-title="1">Async Item 1</div>');
		listContainer.insertAdjacentHTML('beforeend', '<div data-js-pagination-item data-js-pagination-item-title="2">Async Item 2</div>');

		await waitForMutationObserverTick();

		expect(readVisibleItemLabels()).toEqual(['Async Item 1']);
		expect(queryByPage(2)).toBeTruthy();

		queryByPage(2).click();
		expect(readVisibleItemLabels()).toEqual(['Async Item 2']);

		queryByPage(1).click();
		listContainer.insertAdjacentHTML('beforeend', '<div data-js-pagination-item data-js-pagination-item-title="3">Async Item 3</div>');
		listContainer.insertAdjacentHTML('beforeend', '<div data-js-pagination-item data-js-pagination-item-title="4">Async Item 4</div>');

		await waitForMutationObserverTick();

		expect(readVisibleItemLabels()).toEqual(['Async Item 1']);
		queryByPage(3).click();
		expect(readVisibleItemLabels()).toEqual(['Async Item 3']);
	});

	it('does not update pages for asynchronously rendered items without async attribute', async () => {
		const container = createPaginationMarkup({ items: [], asyncItems: false });

		createPaginationInstance(container);

		const listContainer = document.querySelector('[data-js-pagination-container]') as HTMLElement;
		listContainer.insertAdjacentHTML('beforeend', '<div data-js-pagination-item data-js-pagination-item-title="1">Async Item 1</div>');

		await waitForMutationObserverTick();

		expect(document.querySelector('[data-js-pagination-index="2"]')).toBeNull();
	});

	it('updates pages when async attribute is set on pagination element', async () => {
		const container = createPaginationMarkup({ items: [], asyncItems: false, asyncItemsOnPagination: true, perPage: 1 });

		createPaginationInstance(container);

		const listContainer = document.querySelector('[data-js-pagination-container]') as HTMLElement;
		listContainer.insertAdjacentHTML('beforeend', '<div data-js-pagination-item data-js-pagination-item-title="1">Async Item 1</div>');
		listContainer.insertAdjacentHTML('beforeend', '<div data-js-pagination-item data-js-pagination-item-title="2">Async Item 2</div>');

		await waitForMutationObserverTick();

		expect(readVisibleItemLabels()).toEqual(['Async Item 1']);
		expect(queryByPage(2)).toBeTruthy();
	});
});
