import ClassToggle from "./classToggle";

class ClassToggleInitializer {
    /**
     * Initializes ClassToggle instances for all triggers found in the document and sets up a MutationObserver to handle dynamically added triggers.
     */
    public init() {
        this.findTriggers(document.documentElement || document.body).forEach(trigger => {
            this.initTrigger(trigger);
        });

        this.observeAddedNodes();
    }

    /**
     * Observes the document for added nodes and initializes ClassToggle instances for any new triggers found.
     */
    private observeAddedNodes() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === "childList") {
                    mutation.addedNodes.forEach((node) => {
                        console.log('Added node:', node);
                        if (node instanceof HTMLElement) {
                            let triggers = [...this.findTriggers(node)];
                            
                            if (node.hasAttribute(ClassToggle.TRIGGER) || node.hasAttribute(ClassToggle.TRIGGER_DEPRECATED)) {
                                triggers.push(node);
                            }

                            triggers.forEach(trigger => {
                                this.initTrigger(trigger);
                            });
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * Finds all trigger elements within the specified root element.
     * @param element The root element to search within.
     * @returns A NodeList of all trigger elements found.
     */
    private findTriggers(element: HTMLElement): NodeListOf<HTMLElement> {
        return element.querySelectorAll(`[${ClassToggle.TRIGGER}], [${ClassToggle.TRIGGER_DEPRECATED}]`);
    }

    /**
     * Initializes a ClassToggle instance for the specified trigger element.
     * @param trigger The trigger element to initialize.
     */
    private initTrigger(trigger: HTMLElement) {
        let triggerId = trigger.getAttribute(ClassToggle.TRIGGER) || trigger.getAttribute(ClassToggle.TRIGGER_DEPRECATED);

        let groupId = trigger.getAttribute(ClassToggle.GROUP) || trigger.getAttribute(ClassToggle.GROUP_DEPRECATED);

        if (triggerId) {
            new ClassToggle(trigger as HTMLElement, triggerId, groupId);
        }
    }
}

export default ClassToggleInitializer;