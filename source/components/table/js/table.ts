/**
 * Handles filtering, sorting and horizontal scroll interactions for a table component.
 */
class Table {
	private resizeObserver: ResizeObserver | null = null;
	private initialCursorPosition = 0;

	constructor(private config: TableConfigInterface) {}

	// private slider(): void {
	// 	if (!this.indicatorInput || !this.tableInner) {
	// 		return;
	// 	}

	// 	this.indicatorInput.addEventListener('mousedown', (event: MouseEvent) => {
	// 		event.preventDefault();
	// 		this.initialCursorPosition = event.clientX;
	// 		this.tableInner?.removeEventListener('scroll', this.updateOnScrollFunc, false);

	// 		window.addEventListener('mousemove', this.handleMouseMoveFunc, false);
	// 		window.addEventListener('mouseup', this.handleMouseUpFunc, false);
	// 	});
	// }

	// private updateOnScroll(): void {
	// 	if (!this.tableInner || !this.indicatorInput) {
	// 		return;
	// 	}

	// 	const scrolledPixels = this.tableInner.scrollLeft;
	// 	const tableLineWidth = this.tableInner.querySelector<HTMLElement>('.c-table__line')?.offsetWidth ?? 0;

	// 	if (tableLineWidth === 0) {
	// 		this.indicatorInput.style.marginLeft = '0px';
	// 		return;
	// 	}

	// 	this.indicatorInput.style.marginLeft = `${(scrolledPixels / tableLineWidth) * 100}%`;
	// }

	// private handleMouseMove(event: MouseEvent): void {
	// 	if (!this.indicatorContainer || !this.indicatorInput || !this.tableInner || !this.tableTable) {
	// 		return;
	// 	}

	// 	event.preventDefault();
	// 	const scrollMax = this.indicatorContainer.offsetWidth - this.indicatorInput.offsetWidth;
	// 	const inner = this.tableInner;
	// 	const mouseMovedAmount = event.clientX - this.initialCursorPosition;
	// 	const scrolledAmount = this.indicatorInput.getBoundingClientRect().left - this.indicatorContainer.getBoundingClientRect().left;

	// 	if (scrolledAmount <= 0 && !(scrolledAmount + mouseMovedAmount > 0)) {
	// 		this.indicatorInput.style.marginLeft = '0px';
	// 		this.initialCursorPosition = event.clientX;
	// 		inner.scrollLeft = 0;
	// 	} else if (scrolledAmount >= scrollMax && !(scrolledAmount + mouseMovedAmount <= scrollMax)) {
	// 		this.indicatorInput.style.marginLeft = `${scrollMax}px`;
	// 	} else {
	// 		const amountOfOverflow = this.tableTable.offsetWidth - inner.offsetWidth;
	// 		const indicatorPosition = Number.parseInt(this.indicatorInput.style.marginLeft || '0', 10) || 0;

	// 		this.indicatorInput.style.marginLeft = `${indicatorPosition + mouseMovedAmount}px`;
	// 		this.initialCursorPosition = event.clientX;
	// 		inner.scrollLeft = amountOfOverflow * (scrolledAmount / scrollMax);
	// 	}
	// }

	// destroy(): void {
	// 	this.resizeObserver?.disconnect();
	// 	this.tableInner?.removeEventListener('scroll', this.updateOnScrollFunc, false);
	// 	window.removeEventListener('mousemove', this.handleMouseMoveFunc, false);
	// 	window.removeEventListener('mouseup', this.handleMouseUpFunc, false);
	// }

	// private handleMouseUp(event: MouseEvent): void {
	// 	event.preventDefault();
	// 	this.tableInner?.addEventListener('scroll', this.updateOnScrollFunc, false);
	// 	window.removeEventListener('mousemove', this.handleMouseMoveFunc, false);
	// 	window.removeEventListener('mouseup', this.handleMouseUpFunc, false);
	// }

	// private setupResizeObserver(): void {
	// 	if (!this.tableInner || !this.indicatorInput || !this.indicatorContainer) {
	// 		return;
	// 	}

	// 	this.resizeObserver = new ResizeObserver(() => {
	// 		if (!this.tableInner || !this.indicatorInput || !this.indicatorContainer) {
	// 			return;
	// 		}

	// 		const tableLine = this.tableInner.querySelector<HTMLElement>('.c-table__line');

	// 		if (!tableLine) {
	// 			return;
	// 		}

	// 		const tableInnerWidth = this.tableInner.offsetWidth;
	// 		const tableLineWidth = tableLine.offsetWidth;
	// 		const tableScrollIndicatorWidth = tableLineWidth > 0 ? `${(tableInnerWidth / tableLineWidth) * 100}%` : '100%';

	// 		if (tableScrollIndicatorWidth !== '100%') {
	// 			this.indicatorInput.classList.remove('u-display--none');
	// 			this.indicatorContainer.classList.remove('u-display--none');
	// 		} else {
	// 			this.indicatorInput.classList.add('u-display--none');
	// 			this.indicatorContainer.classList.add('u-display--none');
	// 		}

	// 		this.indicatorInput.style.width = tableScrollIndicatorWidth;
	// 		this.tableInner.removeEventListener('scroll', this.updateOnScrollFunc, false);
	// 		this.tableInner.addEventListener('scroll', this.updateOnScrollFunc, false);
	// 	});

	// 	this.resizeObserver.observe(this.table);
	// }
}

export default Table;