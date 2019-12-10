class Fields {
    
    constructor() {
        
     
        this.form = document.getElementsByTagName('form')[0];
        this.formElement = null;
        this.formElementType = null;
        this.formElementPattern = null;
        this.formElementRequired = null;
        this.formElementDataInvalid = null;
        this.formElementDataInvalid = null;

        this.formValidationEventListerners();
        this.fielinpuOnChange();
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
     * A simple input validation
     */
    formValidationEventListerners() {
        
        const self = this;
        const inputs = document.querySelectorAll('input');
        for (const formInput of inputs) {
            
            let inputId = formInput.getAttribute('id');
    
            // On Click event listener - Setting data
            document.getElementById(inputId).addEventListener('click', function (e) {
                self.formElement = this;
                
                self.formElementType = (self.formElement.getAttribute('type')) ?
                    self.formElement.getAttribute('type') : null;
                
                self.formElementPattern = (self.formElement.getAttribute('pattern')) ?
                    self.formElement.getAttribute('pattern') : null;
                
                self.formElementRequired = (self.formElement.getAttribute('data-required')) ?
                    self.formElement.getAttribute('pattern') : null;
                
                self.formElementDataInvalidMessage = (self.formElement.getAttribute('data-invalid-message')) ?
                    self.formElement.getAttribute('data-invalid-message') : '';
            });
            
            // On Change event listener
            document.getElementById(inputId).addEventListener('change', function (e) {
                self.formElement = this;
                
                if (!('remove' in Element.prototype)) {
                    Element.prototype.remove = function() {
                        if (this.parentNode) {
                            this.parentNode.removeChild(this);
                        }
                    };
                }
                
                self.formElement.classList.remove('invalid');
                self.formElement.classList.remove('valid');
                
                // If Require is on
                if (self.formElementRequired) {
                    
                    let valid = false;
                    if (self.formElementPattern) {
                        valid = (self.formElement.value.match(self.formElementPattern)) ? true : false;
                    } else {
                        let valid = true;
                    }
                    
                    const id = self.formElement.getAttribute('id');
                    const message = self.formElement.getAttribute('id');
                    
                    if (!valid && !this.checkValidity()) {
                        self.formElement.classList.add('invalid');
                        
                        if (self.formElementDataInvalidMessage) {
                            const errorMessage = document.getElementById('error_'+id+'_message');
                            errorMessage.classList.add('error');
                            errorMessage.getElementsByClassName("errorText")[0].innerHTML = self.formElementDataInvalidMessage;
                        }
                
                    } else {
                        document.getElementById('error_'+id+'_message').classList.remove('error');
                        self.formElement.className = "valid";
                    }
                }
        
            });
    
        }
        

    }
    
    
}

export default Fields;