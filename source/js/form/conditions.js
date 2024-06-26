class Conditions {
    constructor(form) {
        form && this.init(form);
    }

    init(form) {
        const groups = form.querySelectorAll('[conditional-target]');
        const conditionalElements = form.querySelectorAll('[conditional]') && Array.from(form.querySelectorAll('[conditional]')).map(element => element).filter(element => element.getAttribute('conditional'));

        let condtionalTargets = [];
        Array.from(groups).forEach(group => {
            condtionalTargets.push({element: group, json: JSON.parse(group.getAttribute('conditional-target'))});
            this.handleRequired(group.querySelectorAll('[data-js-required]'), true);      
        });
        

        conditionalElements.forEach(element => {
            element.addEventListener('change', (e) => {
                let conditions = element.getAttribute('conditional');
                conditions = JSON.parse(conditions.replace(/'/g, '"'));
                this.show(conditions, condtionalTargets);
            })
        })

    }

    show(conditions, condtionalTargets) {
        condtionalTargets.forEach(arr => {
            if (conditions.label === arr.json.label) {
                if (conditions.value === arr.json.value) {
                    arr.element.style.display = 'block';
                    this.handleRequired(arr.element.querySelectorAll('[js-no-validation]' , false));
                } else {
                    arr.element.style.display = 'none';
                    this.handleRequired(arr.element.querySelectorAll('[data-js-required]'), true)
                }
            }
        });
    }

    handleRequired(inputs, isHidden) {
        inputs && inputs.forEach(input => {
            if(isHidden) {
                input.setAttribute('js-no-validation', '');
                input.removeAttribute('required');
                
            } else {
                input.removeAttribute('js-no-validation');
                if (input.hasAttribute('data-js-required')) {
                    input.setAttribute('required', '');
                }
            }
        });   
    }
}
export default Conditions;