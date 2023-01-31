class Checkbox {
    constructor(params) {
        this.test(params);
    }

    test({ form, inputs, checkboxGroups, checkboxHandler, policyHandler, fileinputHandler }) {

        const groups = form.querySelectorAll('[conditional-target]');
        const conditionalElements = form.querySelectorAll('[conditional]') && Array.from(form.querySelectorAll('[conditional]')).map(element => element).filter(element => element.getAttribute('conditional'));

        let condtionalTargets = [];
        Array.from(groups).forEach(group => {
            condtionalTargets.push({element: group, json: JSON.parse(group.getAttribute('conditional-target'))});
            this.handleRequired(group.querySelectorAll('[js-required], input[required="true"]'), true);      
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
        console.log(conditions);
        condtionalTargets.forEach(arr => {
            if (conditions.label === arr.json.label) {
                if (conditions.value === arr.json.value) {
                    arr.element.style.display = 'block';
                    this.handleRequired(arr.element.querySelectorAll('[js-required-hidden], js-input-required-hidden'), false)
                } else {
                    arr.element.style.display = 'none';
                    this.handleRequired(arr.element.querySelectorAll('[js-required], input[required="true"]'), true)
                }
            }
        });
    }

    handleRequired(inputs, isHidden = false) {
        inputs && inputs.forEach(input => {
            if(isHidden) {
                input.setAttribute('js-no-validation', '');
                if (input.hasAttribute('required') && input.getAttribute('required')) {
                    input.setAttribute('required', 'false');
                }
            } else {
                input.removeAttribute('js-no-validation');
                if (input.hasAttribute('required') && input.getAttribute('required')) {
                    input.setAttribute('required', 'true');
                }
            }

/*             if (input.hasAttribute('js-required')) {
                this.handleAttributes(input, { addAttr: 'js-required-hidden', addVal: '' }, {removeAttr: 'js-required', removeVal: ''});
            } else if (input.hasAttribute('js-required-hidden')) {
                this.handleAttributes(input, { addAttr: 'js-required', addVal: '' }, { removeAttr: 'js-required-hidden', removeVal: '' });
            } 
            
            if(input.hasAttribute('required')) {
                this.handleAttributes(input, { addAttr: 'js-input-required-hidden', addVal: '' }, {removeAttr: 'required', 'removeVal': 'true'});
            } else if (input.hasAttribute('js-input-required-hidden')) {

            } */
        });   
    }

    handleAttributes(input, {addAttr, addVal}, {removeAttr, removeVal}) {
        input.removeAttribute(removeAttr);
        input.setAttribute(addAttr, addVal);
    }
}
export default Checkbox;