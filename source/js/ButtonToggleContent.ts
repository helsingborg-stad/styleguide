export default class ButtonToggleContent {
    private labelAttr: string;
    private iconAttr: string;
    private toggles: Element[];
    private viewTransitionId: number;
    private widthAnimations: WeakMap<HTMLElement, Animation>;

    constructor() {
        this.labelAttr = 'data-toggle-label';
        this.iconAttr = 'data-toggle-icon';
        this.toggles = [];
        this.viewTransitionId = 0;
        this.widthAnimations = new WeakMap();

        this.init();
        this.setupMutationObserver();
    } 

    private init(): void {
        this.toggles = Array.from(document.querySelectorAll(`[${this.labelAttr}], [${this.iconAttr}]`));

        this.toggles.forEach((toggle: Element) => {
            toggle.addEventListener(
                'click',
                () => this.handleToggleClick(toggle)
            );
        });
    }

    private handleToggleClick = (toggle: Element): void => {
        const labelAttrVal: string | null = toggle.hasAttribute(this.labelAttr) ? toggle.getAttribute(this.labelAttr) : null;
        const iconAttrVal: string | null = toggle.hasAttribute(this.iconAttr) ? toggle.getAttribute(this.iconAttr) : null;
        const labelEl: Element | null = toggle.querySelector('[class*="c-button__label-text"]');
        const iconEl: Element | null = toggle.querySelector('[class*="c-icon"] > span');
        const contentElements = [
            ...(labelAttrVal && labelEl ? [labelEl] : []),
            ...(iconAttrVal && iconEl ? [iconEl] : [])
        ];
        const currentLabel = labelEl?.innerHTML.trim();
        const currentIcon = iconEl?.innerHTML.trim();
        const currentAriaLabel = toggle.getAttribute('aria-label');

        const toggleElement = toggle as HTMLElement;
        this.clearWidthAnimation(toggleElement);
        const initialWidth = toggleElement.getBoundingClientRect().width;
        const updateContent = (): void => {
            if (labelAttrVal && labelEl) {
                labelEl.innerHTML = labelAttrVal;
                toggle.setAttribute(this.labelAttr, currentLabel ?? '');
                toggle.setAttribute('aria-label', labelAttrVal); 
            }

            if (iconAttrVal && iconEl) {
                iconEl.innerHTML = iconAttrVal;
                toggle.setAttribute(this.iconAttr, currentIcon ?? '');
            }
        };
        const restoreContent = (): void => {
            if (labelAttrVal && labelEl) {
                labelEl.innerHTML = currentLabel ?? '';
                toggle.setAttribute(this.labelAttr, labelAttrVal);

                if (currentAriaLabel === null) {
                    toggle.removeAttribute('aria-label');
                } else {
                    toggle.setAttribute('aria-label', currentAriaLabel);
                }
            }

            if (iconAttrVal && iconEl) {
                iconEl.innerHTML = currentIcon ?? '';
                toggle.setAttribute(this.iconAttr, iconAttrVal);
            }
        };
        const targetWidth = this.measureTargetWidth(toggleElement, updateContent, restoreContent);
        const updateWithTransition = (update: () => void): void => {
            if (contentElements.length === 0 || !this.canUseViewTransitions()) {
                update();
                this.playFallbackTransition(contentElements);
                return;
            }

            const transitionNames = this.assignViewTransitionNames(contentElements);

            try {
                const transition = document.startViewTransition!(update);
                void transition.finished.finally(() => this.clearViewTransitionNames(contentElements, transitionNames));
            } catch {
                this.clearViewTransitionNames(contentElements, transitionNames);
                update();
            }
        };

        if (targetWidth <= initialWidth) {
            updateWithTransition(() => {
                updateContent();
                this.animateWidth(toggleElement, initialWidth, targetWidth);
            });
            return;
        }

        const didAnimate = this.animateWidth(toggleElement, initialWidth, targetWidth, () => {
            updateWithTransition(updateContent);
        });
        if (!didAnimate) {
            updateWithTransition(updateContent);
        }
    }

    private canUseViewTransitions(): boolean {
        return typeof document.startViewTransition === 'function' &&
            !this.prefersReducedMotion();
    }

    private prefersReducedMotion(): boolean {
        return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    private playFallbackTransition(elements: Element[]): void {
        if (this.prefersReducedMotion()) {
            return;
        }

        elements.forEach((element) => {
            element.classList.add('is-toggle-content-entering');
        });
        window.setTimeout(() => {
            elements.forEach((element) => {
                element.classList.remove('is-toggle-content-entering');
            });
        }, 50);
    }

    private measureTargetWidth(
        element: HTMLElement,
        updateContent: () => void,
        restoreContent: () => void
    ): number {
        updateContent();
        const targetWidth = element.getBoundingClientRect().width;
        restoreContent();

        return targetWidth;
    }

    private animateWidth(
        element: HTMLElement,
        initialWidth: number,
        targetWidth: number,
        onFinish?: () => void
    ): boolean {
        if (this.prefersReducedMotion() || typeof element.animate !== 'function') {
            return false;
        }

        if (Math.abs(targetWidth - initialWidth) < 1) {
            return false;
        }

        element.style.width = `${initialWidth}px`;
        const animation = element.animate(
            [
                { width: `${initialWidth}px` },
                { width: `${targetWidth}px` }
            ],
            {
                duration: 50,
                easing: 'ease-out',
                fill: 'both'
            }
        );
        this.widthAnimations.set(element, animation);
        animation.addEventListener('finish', () => {
            if (this.widthAnimations.get(element) !== animation) {
                return;
            }

            this.widthAnimations.delete(element);
            element.style.removeProperty('width');
            animation.cancel();
            onFinish?.();
        }, { once: true });

        return true;
    }

    private clearWidthAnimation(element: HTMLElement): void {
        const animation = this.widthAnimations.get(element);
        if (!animation) {
            return;
        }

        animation.cancel();
        this.widthAnimations.delete(element);
        element.style.removeProperty('width');
    }

    private assignViewTransitionNames(elements: Element[]): string[] {
        return elements.map((element) => {
            const name = `button-toggle-content-${this.viewTransitionId++}`;
            (element as HTMLElement).style.viewTransitionName = name;
            return name;
        });
    }

    private clearViewTransitionNames(elements: Element[], names: string[]): void {
        elements.forEach((element, index) => {
            const styledElement = element as HTMLElement;
            if (styledElement.style.viewTransitionName === names[index]) {
                styledElement.style.removeProperty('view-transition-name');
            }
        });
    }

    private setupMutationObserver(): void {
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    const addedNodes: Node[] = Array.from(mutation.addedNodes);
                    const toggles: Element[] = addedNodes.reduce((acc: Element[], node: Node) => {
                        if (node instanceof HTMLElement) {
                            acc.push(...Array.from(node.querySelectorAll(`[${this.labelAttr}], [${this.iconAttr}]`)));
                        }

                        return acc;
                    }, []);
                    toggles.forEach((toggle: Element) => {
                        toggle.addEventListener(
                            'click',
                            () => this.handleToggleClick(toggle)
                        );
                    });
                    this.toggles = [...this.toggles, ...toggles];
                }
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
}
