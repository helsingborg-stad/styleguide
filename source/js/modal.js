
export default class Modal {
    enableModals() {
        const openTrigger = document.querySelectorAll("[data-open]");
        const isVisible = "c-modal__is-visible";
        
        for(const trigger of openTrigger) {
            trigger.addEventListener("click", function() {
                const modalId = this.dataset.open;
                document.getElementById(modalId).classList.add(isVisible);
            });
        }

        const closeTrigger = document.querySelectorAll("[data-close]");
        
        for (const trigger of closeTrigger) {
            trigger.addEventListener("click", function() {
                this.parentElement.parentElement.parentElement.classList.remove(isVisible);
            });
        }
 
        document.addEventListener("click", e => {
            if (e.target == document.querySelector(`.${isVisible}`)) {
                document.querySelector(`.${isVisible}`).classList.remove(isVisible);
            }
        });

        document.addEventListener("keyup", e => {
            if (e.key == "Escape" && document.querySelector(`.${isVisible}`)) {
                document.querySelector(`.${isVisible}`).classList.remove(isVisible);
            }
        });
    }
}