class TableScrollIndicator {
	private readonly wrapper: HTMLElement;
	private readonly table: HTMLElement;
	private readonly indicator: HTMLElement;
	private readonly indicatorContainer: HTMLElement;
	private readonly onPointerDown = (event: PointerEvent) => this.startDrag(event);
	private readonly onScroll = () => this.scheduleSync();
	private readonly onPointerMove = (event: PointerEvent) => this.handlePointerMove(event);
	private readonly onPointerUp = () => this.stopDrag();
	private readonly resizeObserver = new ResizeObserver(() => this.scheduleSync());
	private pointerStartX = 0;
	private pointerStartLeft = 0;
	private isDragging = false;
	private syncScheduled = false;

	constructor(private readonly tableConfig: TableConfigInterface) {
		this.wrapper = this.tableConfig.getTableWrapper()!;
		this.table = this.tableConfig.getTableElement()!;
		this.indicator = this.tableConfig.getScrollIndicator()!;
		this.indicatorContainer = this.tableConfig.getScrollIndicatorContainer()!;

		this.init();
	}

	private init(): void {
		this.indicator.style.marginLeft = '0px';
		this.wrapper.addEventListener('scroll', this.onScroll, { passive: true });
		this.indicator.addEventListener('pointerdown', this.onPointerDown);
		window.addEventListener('pointermove', this.onPointerMove);
		window.addEventListener('pointerup', this.onPointerUp);
		window.addEventListener('pointercancel', this.onPointerUp);
		this.resizeObserver.observe(this.wrapper);
		this.resizeObserver.observe(this.table);
		this.scheduleSync();
	}

	private scheduleSync(): void {
		if (this.syncScheduled) {
			return;
		}

		this.syncScheduled = true;
		requestAnimationFrame(() => {
			this.syncScheduled = false;
			this.syncIndicator();
		});
	}

	private startDrag(event: PointerEvent): void {
		event.preventDefault();
		this.isDragging = true;
		this.pointerStartX = event.clientX;
		this.pointerStartLeft = Number.parseFloat(this.indicator.style.marginLeft || '0') || 0;
		this.indicator.setPointerCapture?.(event.pointerId);
	}

	private handlePointerMove(event: PointerEvent): void {
		if (!this.isDragging) {
			return;
		}

		const maxTrack = Math.max(this.indicatorContainer.clientWidth - this.indicator.offsetWidth, 0);

		if (maxTrack === 0) {
			return;
		}

		const delta = event.clientX - this.pointerStartX;
		const targetLeft = Math.min(Math.max(this.pointerStartLeft + delta, 0), maxTrack);
		const maxScroll = Math.max(this.table.scrollWidth - this.wrapper.clientWidth, 0);

		this.indicator.style.marginLeft = `${targetLeft}px`;
		this.wrapper.scrollLeft = maxScroll * (targetLeft / (maxTrack || 1));
	}

	private stopDrag(): void {
		if (!this.isDragging) {
			return;
		}

		this.isDragging = false;
		this.pointerStartX = 0;
		this.pointerStartLeft = 0;
	}

	private syncIndicator(): void {
		const maxScroll = Math.max(this.table.scrollWidth - this.wrapper.clientWidth, 0);
		const shouldShow = maxScroll > 0;

		this.indicatorContainer.classList.toggle('u-display--none', !shouldShow);
		this.indicator.classList.toggle('u-display--none', !shouldShow);

		if (!shouldShow) {
			this.indicator.style.marginLeft = '0px';
			return;
		}

		const indicatorWidth = Math.max((this.wrapper.clientWidth / this.table.scrollWidth) * 100, 15);

		this.indicator.style.width = `${indicatorWidth}%`;

		const maxTrack = Math.max(this.indicatorContainer.clientWidth - this.indicator.offsetWidth, 0);
		const ratio = Math.min(Math.max(this.wrapper.scrollLeft / maxScroll, 0), 1);

		this.indicator.style.marginLeft = `${ratio * maxTrack}px`;
	}

	destroy(): void {
		this.wrapper.removeEventListener('scroll', this.onScroll);
		this.indicator.removeEventListener('pointerdown', this.onPointerDown);
		window.removeEventListener('pointermove', this.onPointerMove);
		window.removeEventListener('pointerup', this.onPointerUp);
		window.removeEventListener('pointercancel', this.onPointerUp);
		this.resizeObserver.disconnect();
	}
}

export default TableScrollIndicator;