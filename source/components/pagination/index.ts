import Pagination from './script/pagination';
import { PAGINATION_ATTRIBUTES } from './script/types';

export function init(): void {
	document.addEventListener('DOMContentLoaded', () => {
		const paginations = [...document.querySelectorAll(`[${PAGINATION_ATTRIBUTES.target}]`)];

		paginations.forEach((pagination, index) => {
			new Pagination(pagination as HTMLElement, index + 1);
		});
	}, { once: true });
}