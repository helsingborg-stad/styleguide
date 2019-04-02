HelsingborgPrime = HelsingborgPrime || {};
HelsingborgPrime.Helper = HelsingborgPrime.Helper || {};

HelsingborgPrime.Helper.HyperForm = (function ($) {

    function HyperForm() {
        document.addEventListener("DOMContentLoaded", function() {
            this.confirmValidationFields();
        }.bind(this));
    }

    HyperForm.prototype.confirmValidationFields = function() {
        if (typeof(hyperform) == 'undefined') {
            return;
        }

        var confirmFields = document.querySelectorAll("[data-confirm-field]");
        if (confirmFields.length == 0) {
            return;
        }

        Object.values(confirmFields).forEach(function(element) {
            var target = element.getAttribute('data-confirm-field');
            target = document.getElementById(target);

            if (target !== null && target !== 'undefined') {
                var message = element.getAttribute('data-confirm-message');
                message = (message == null || message.length == 0) ? 'Control field does not match' : message;

                this.addConfirmValidation(target, element, message);
            }
        }.bind(this));
    };

    HyperForm.prototype.addConfirmValidation = function(target, confirmField, message) {
        hyperform.addValidator(
            confirmField,
            function(element) {
                var valid = element.value === target.value;
                element.setCustomValidity(
                    valid ?
                    '' :
                    message
                );
                return valid;
            }
        );

        target.addEventListener('keyup', function() {
            confirmField.reportValidity();
        });
    };

    return new HyperForm();
})(jQuery);


