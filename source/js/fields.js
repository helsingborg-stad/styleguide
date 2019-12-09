class Fields {

    constructor() {
        this.fielinpuOnChange();
        if (document.querySelectorAll('[data-validation]').length > 0) {
            //this.styleGuideDemo();
        }

        // There are fewer ways to pick a DOM node with legacy browsers
        this.form = document.getElementsByTagName('form')[0];
        this.email = document.getElementById('mail');
        this.formElement = null;
// The following is a trick to reach the next sibling Element node in the DOM
// This is dangerous because you can easily build an infinite loop.
// In modern browsers, you should prefer using element.nextElementSibling

       // while ((error = error.nextSibling).nodeType != 1) ;

// As per the HTML5 Specification


        this.formEventListerners();
    }

    /**
     * File input
     */
    fielinpuOnChange() {

        const fileIn = document.getElementById('fileinput');

        if (fileIn !== null) {
            fileIn.onchange = function () {

                fileIn.addEventListener('onChange', (event) => {

                    if (event.target.files && event.target.files[0]) {

                        let upload = document.createElement('div');
                        let wrapper = document.querySelector('.c-fileinput');

                        upload.setAttribute('id', 'fileNameContainer');
                        wrapper.appendChild(upload);

                        let ufiles = '<ul>';
                        for (let int = 0; int < event.target.files.length; int++) {
                            ufiles += '<li><i class=" c-icon c-icon--cloud-upload "><span class="c-icon__label"> ' +
                                event.target.files[int].name + '</span></i></li>';
                        }
                        ufiles += '</ul>';
                        document.getElementById('fileNameContainer').innerHTML = ufiles;
                    }

                });
            };
        }
    }

    /**
     * Demo trigger for inputs
     */
    styleGuideDemo() {

       /* const demoElement = document.querySelectorAll('.styleGuideDemo');
        const validation = document.querySelectorAll('[data-validation]');

        var inputs = document.querySelectorAll('input, textarea');
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].addEventListener('blur', function (e) {
                if (!this.checkValidity()) {
                    if (!this.classList.contains('invalid')) {
                        this.focus();
                    }

                    this.classList.add('invalid');
                    if (!this.checkValidity()) {
                        HTMLFormElement.reportValidity();
                    }

                    //document.forms.demoForm.reportValidity();
                } else {
                    this.classList.remove('invalid');
                }
            });
        }
        */
    }

    /*
    for(const inputDemoElement of validation) {
        // Just before submit, the invalid event will fire, let's apply our class there.
        inputDemoElement.addEventListener('invalid', (event) => {
            inputDemoElement.classList.add('error');
            inputDemoElement.checkValidity();
            inputDemoElement.focus();
            console.log(inputDemoElement);
            const checkElement = new KeyboardEvent("keypress", {
                view: window,
                keyCode: 13,
                bubbles: true,
                cancelable: true
            });
            inputDemoElement.dispatchEvent(checkElement);
        }, false);
    }
    */
    /*
    for(const inputDemoElement of demoElement) {
        const elementId = inputDemoElement.getAttribute('data-uid');
        document.querySelector('[data-uid]').addEventListener('focusout',
            function (event) {

            const checkElement = new KeyboardEvent("keypress", {
                view: window,
                keyCode: 13,
                bubbles: true,
                cancelable: true
            });
            document.getElementById(elementId).dispatchEvent(checkElement);
        }, false);
    }


}

*/


    /**
     *
     */
    formEventListerners() {
        
        const self = this;
        const inputs = document.querySelectorAll('input, textarea');

        //for (let int = 0; int < inputs.length; int++) {    Kollaar söndag....

            this.formElement = inputs[int];
            this.formElement = inputs;
            this.formElementType = this.formElement.getAttribute('type');
            
            const pattern = (this.formElement.getAttribute('pattern')) ?
                this.formElement.getAttribute('pattern') : false;
            
            const required = (this.formElement.getAttribute('required')) ?
                this.formElement.getAttribute('required') : false;
            //const type = this.formElement.getAttribute('type');
            
            const invalidMessage = (this.formElement.getAttribute('data-invalid')) ?
                this.formElement.getAttribute('data-invalid') : false;
            
            if(required) {
                this.form.addEventListener('load', function (e) {
                    const test = self.formElement.value.length === 0 || pattern.test(self.formElement.value);
                    self.formElement.className = test ? "valid" : "invalid";
                });


                // This defines what happens when the user types in the field
                this.form.addEventListener('change', function (e) {
                    
                    const inputCheck = self.formElement.value.length === 0 || pattern.test(self.formElement);
                    if (!this.checkValidity()) {
                        console.log('Not valid');
                    }
                    if (inputCheck && this.checkValidity()) {
    
                        console.log('No nono valid');
                        self.formElement.className = "invalid";
                        
                    } else {
                        
    
                        console.log('valid');
                        self.formElement.className = "valid";
                        if (invalidMessage) {
                            self.formElement.nextElementSibling.innerHTML =
                                (self.formElement.nextElementSibling.classList.contains('c-field__input-error-message'))
                                    ? invalidMessage : null;
                        }
                    }
                });

                // This defines what happens when the user tries to submit the data
                this.form.addEventListener('submit', function (e) {

                    const submittCheck = this.formElement.value.length === 0 || pattern.test(this.formElement.value);

                    if (!submittCheck) {
                        this.formElement.className = "invalid";
                        self.formElement.innerHTML = "I expect an e-mail, darling!";
                        self.formElement.className = "error active";

                        // Some legacy browsers do not support the event.preventDefault() method
                        return false;
                    } else {
                        this.formElement.className = "valid";
                        self.formElement.innerHTML = "";
                        self.formElement.className = "error";
                    }
                });
            }


        //}
    }


}

export default Fields;