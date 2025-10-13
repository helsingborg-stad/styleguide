class ClassToggle {
    public static readonly TRIGGER: string = 'data-js-toggle-trigger';
    public static readonly ITEM: string = 'data-js-toggle-item';
    public static readonly CLASS: string = 'data-js-toggle-class';
    public static readonly GROUP: string = 'data-js-toggle-group';

    // Deprecated - to be removed in future versions
    public static readonly TRIGGER_DEPRECATED: string = 'js-toggle-trigger';
    public static readonly ITEM_DEPRECATED: string = 'js-toggle-item';
    public static readonly CLASS_DEPRECATED: string = 'js-toggle-class';
    public static readonly GROUP_DEPRECATED: string = 'js-toggle-group';

    private static groups: { [group: string]: { [id: string]: ClassToggle } } = {};

    /**
     * Creates an instance of the ClassToggle class.
     * @param trigger The HTML element that triggers the toggle.
     * @param id The unique identifier for the toggle.
     * @param groupId The group identifier for the toggle, if any.
     */
    constructor(private trigger: HTMLElement, private id: string, private groupId: string | null = null) {
        if (this.groupId) {
            ClassToggle.groups[this.groupId] = ClassToggle.groups[this.groupId] || {};
            ClassToggle.groups[this.groupId][this.id] = this;
        }

        this.setToggleListener();
    }

    /**
     * Sets the event listener on the trigger element to handle toggle actions.
     */
    private setToggleListener() {
        this.trigger.addEventListener('click', (event) => {
            this.toggle();

            if (this.groupId) {
                this.toggleGroupMembers();
            }
        });
    }

    /**
     * Toggles the class on all associated toggle items.
     */
    private toggle() {
        this.getToggleItems().forEach((item) => {
            item.classList.toggle(item.getAttribute(ClassToggle.CLASS) || item.getAttribute(ClassToggle.CLASS_DEPRECATED) || 'is-active');
        });
    }

    /**
     * Gets all toggle items associated with this toggle instance.
     * @returns A NodeList of all HTML elements associated with this toggle instance.
     */
    private getToggleItems(): NodeListOf<HTMLElement> {
        return document.querySelectorAll(`[${ClassToggle.ITEM}="${this.id}"], [${ClassToggle.ITEM_DEPRECATED}="${this.id}"]`);
    }

    private toggleGroupMembers() {
        const group = ClassToggle.groups[this.groupId!];

        for (const memberId in group) {
            if (memberId !== this.id) {
                group[memberId].close();
            }
        }
    }

    /**
     * Closes the toggle by removing the active class from all associated toggle items.
     */
    public close() {
        this.trigger.setAttribute('aria-pressed', 'false');

        this.getToggleItems().forEach((item) => {
            item.classList.remove(item.getAttribute(ClassToggle.CLASS) || item.getAttribute(ClassToggle.CLASS_DEPRECATED) || 'is-active');
        });
    }
}

export default ClassToggle;