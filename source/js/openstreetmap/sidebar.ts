import { mutationObserver } from "../helpers/Observer";
class ControlSidebar {
    baseClass: string;
    container: HTMLElement;
    constructor(container: HTMLElement) {
        this.baseClass = 'c-openstreetmap';
        this.container = container;
        this.container && this.init()
    }

    init() {
        this.expandSidebar();
        this.observeSizeClasses();
    }

    observeSizeClasses() {
        const options = {
            attributes: true,
            attributeFilter: ['class'],
            attributeOldValue: true,
            subtree: false,
        };

        mutationObserver(this.container, options, (mutation: MutationRecord) => {
            if (this.getMutationCondition(mutation)) {
                const previousClasses = mutation.oldValue?.split(' ');
                const currentClasses = this.container.className.split(' ');
                const removedClasses = previousClasses?.filter(className => !currentClasses.includes(className));

                if (removedClasses && removedClasses.includes(`${this.baseClass}--size-sm`)) {
                    this.expandSidebar();
                }
            }
        });
    }

    getMutationCondition(mutation: MutationRecord) {
        return(
            mutation.type === 'attributes' && 
            mutation.attributeName === 'class' &&
            mutation.oldValue !== this.container.className &&
            !this.container.classList.contains('is-expanded') &&
            !this.container.classList.contains(`${this.baseClass}--size-sm`)
        );
    }

    expandSidebar() {
        if (!this.container.classList.contains(`${this.baseClass}--size-sm`)) {
            this.container.classList.add('is-expanded');
        }
    }
}
export default ControlSidebar;