import PaginationFactory from './script/paginationFactory';
import { PAGINATION_ATTRIBUTES } from './script/interface';

export function init(): void {
	document.addEventListener('DOMContentLoaded', () => {
		const paginations = [...document.querySelectorAll(`[${PAGINATION_ATTRIBUTES.target}]`)];
		const paginationFactory = new PaginationFactory();

		paginations.forEach((pagination, index) => {
			paginationFactory.create(pagination as HTMLElement, index + 1);
		});
	}, { once: true });
}