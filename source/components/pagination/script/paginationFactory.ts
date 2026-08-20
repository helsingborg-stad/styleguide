import Pagination from './pagination';
import PaginationInitializer from './paginationInitializer';

/**
 * Creates pagination instances from container elements.
 */
class PaginationFactory {
	private readonly initializer: PaginationInitializer;

	constructor(initializer: PaginationInitializer = new PaginationInitializer()) {
		this.initializer = initializer;
	}

	public create(container: HTMLElement, index: number): Pagination {
		const initialization = this.initializer.resolve(container);

		return new Pagination(container, index, initialization);
	}
}

export default PaginationFactory;