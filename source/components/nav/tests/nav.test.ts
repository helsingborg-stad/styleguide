import { init } from '../index';

function renderNavigation(href: string, includeToggle = true) {
	document.body.innerHTML = `
		<ul class="c-nav c-nav--horizontal c-nav--depth-1">
			<li class="c-nav__item has-children has-toggle">
				<div class="c-nav__item-wrapper">
					<a class="c-nav__link" href="${href}"><span>Parent item</span></a>
					${includeToggle ? '<button class="c-nav__toggle" type="button">Expand</button>' : ''}
				</div>
			</li>
		</ul>
	`;

	return {
		link: document.querySelector('.c-nav__link') as HTMLAnchorElement,
		toggle: document.querySelector('.c-nav__toggle') as HTMLButtonElement | null,
	};
}

describe('Nav', () => {
	beforeAll(() => {
		init();
		document.dispatchEvent(new Event('DOMContentLoaded'));
	});

	afterEach(() => {
		document.body.innerHTML = '';
	});

	it('expands children through the toggle button when the main link points to #', () => {
		const { link, toggle } = renderNavigation('#');
		const toggleClick = jest.fn();
		toggle?.addEventListener('click', toggleClick);

		const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
		link.querySelector('span')?.dispatchEvent(clickEvent);

		expect(clickEvent.defaultPrevented).toBe(true);
		expect(toggleClick).toHaveBeenCalledTimes(1);
	});

	it('keeps navigation behavior for a main link with a real URL', () => {
		const { link, toggle } = renderNavigation('/destination');
		const toggleClick = jest.fn();
		let wasPreventedByNav = false;
		toggle?.addEventListener('click', toggleClick);
		document.addEventListener(
			'click',
			(event) => {
				wasPreventedByNav = event.defaultPrevented;
				event.preventDefault();
			},
			{ once: true },
		);

		const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
		link.dispatchEvent(clickEvent);

		expect(wasPreventedByNav).toBe(false);
		expect(toggleClick).not.toHaveBeenCalled();
	});

	it('keeps default link behavior when a # link has no toggle button', () => {
		const { link } = renderNavigation('#', false);
		let wasPreventedByNav = false;
		document.addEventListener(
			'click',
			(event) => {
				wasPreventedByNav = event.defaultPrevented;
				event.preventDefault();
			},
			{ once: true },
		);

		const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
		link.dispatchEvent(clickEvent);

		expect(wasPreventedByNav).toBe(false);
	});
});
