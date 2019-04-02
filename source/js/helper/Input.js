HelsingborgPrime = HelsingborgPrime || {};
HelsingborgPrime.Helper = HelsingborgPrime.Helper || {};

HelsingborgPrime.Helper.Input = (function ($) {

    function Input() {
        $('form input, form select').on('invalid', function (e) {
            this.invalidMessage(e.target);
        }.bind(this));

        $('form').on('submit', function (e) {
            var isValid = this.validateDataRequire(e.target);

            if (!isValid) {
                e.preventDefault();
                return false;
            }

            return true;
        }.bind(this));
    }

    Input.prototype.invalidMessage = function (element) {
        var $target = $(element);
        var message = $target.attr('data-invalid-message');

        if (message) {
            element.setCustomValidity(message);
        }

        return false;
    };

    Input.prototype.validateDataRequire = function(form) {
        var $form = $(form);
        var $checkboxes = $form.find('input[type="checkbox"][data-require]');
        var checkboxNames = [];
        var isValid = true;

        $('input[type="checkbox"][data-require]').on('change', function (e) {
            e.stopPropagation();
            $form.find('.checkbox-invalid-msg').remove();
        });

        $checkboxes.each(function (index, element) {
            if (checkboxNames.indexOf($(this).attr('name')) > -1) {
                return;
            }

            checkboxNames.push($(this).attr('name'));
        });

        $.each(checkboxNames, function (index, name) {
            if ($form.find('input[type="checkbox"][name="' + name + '"][data-require]:checked').length > 0) {
                return;
            }

            $parent = $form.find('input[type="checkbox"][name="' + name + '"][data-require]').first().parents('.form-group');
            $parent.append('<div class="checkbox-invalid-msg text-danger text-sm" aria-live="polite">Select at least one option</div>');
            isValid = false;
        });

        return isValid;
    };

    return new Input();

})(jQuery);
