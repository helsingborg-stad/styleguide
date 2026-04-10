export interface DetailsMenuDismissController {
	dispose(): void;
}

function getOpenMenus(root: ParentNode): HTMLDetailsElement[] {
	return Array.from(root.querySelectorAll<HTMLDetailsElement>('details[open].db-header-menu, details[open].db-presets-menu'));
}

function closeMenu(menu: HTMLDetailsElement | null): void {
	if (!menu) {
		return;
	}

	menu.open = false;
	menu.removeAttribute('open');
}

export function createDetailsMenuDismissController(root: HTMLElement): DetailsMenuDismissController {
	const handleRootClick = (event: Event) => {
		const target = event.target;
		if (!(target instanceof Element)) {
			return;
		}

		const actionButton = target.closest<HTMLElement>('.db-header-menu-content .db-btn, .db-presets-menu-content .db-btn');
		if (!actionButton) {
			return;
		}

		closeMenu(actionButton.closest<HTMLDetailsElement>('details'));
	};

	const handleDocumentPointerDown = (event: Event) => {
		const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
		for (const menu of getOpenMenus(root)) {
			if (!path.includes(menu)) {
				closeMenu(menu);
			}
		}
	};

	root.addEventListener('click', handleRootClick);
	document.addEventListener('pointerdown', handleDocumentPointerDown, true);

	return {
		dispose: () => {
			root.removeEventListener('click', handleRootClick);
			document.removeEventListener('pointerdown', handleDocumentPointerDown, true);
		},
	};
}