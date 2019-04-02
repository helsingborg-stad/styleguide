//
// @name File selector
// @description
//
HelsingborgPrime = HelsingborgPrime || {};
HelsingborgPrime.Component = HelsingborgPrime.Component || {};

HelsingborgPrime.Component.File = (function ($) {

    function File() {
        this.handleEvents();
    }

    File.prototype.handleEvents = function () {
        if($('.input-file input[type="file"]').length) {
            $(document).on('change', '.input-file input[type="file"]', function (e) {
                this.setSelected(e.target);
            }.bind(this));

            $('.input-file input[type="file"]').trigger('change');
        }
    };

    File.prototype.setSelected = function(fileinput) {

        if($(fileinput).length) {
            var $fileinput = $(fileinput);
            var $label = $fileinput.parents('label.input-file');
            var $duplicate = $label.parent('li').clone().find('input').val('').end();

            if ($fileinput.val()) {
                $label.find('.input-file-selected').text($fileinput.val());
            }

            if ($fileinput.val() && $label.parent('li').length) {
                var max = $label.parent('li').parent('ul').attr('data-max');

                if ($label.parent('li').parent('ul').find('li').length < max || max < 0) {
                    $label.parents('ul').append($duplicate);
                }
            }
        }
    };

    return new File();

})(jQuery);
