//
// @name Modal
// @description  Show accodrion dropdown, make linkable by updating adress bar
//
HelsingborgPrime = HelsingborgPrime || {};
HelsingborgPrime.Component = HelsingborgPrime.Component || {};

HelsingborgPrime.Component.Dropdown = (function ($) {

    function Dropdown() {
        this.handleEvents();
        this.jsDropDown();
    }

    Dropdown.prototype.jsDropDown = function () {
        $(document).on('click', $('.js-dropdown__toggle'), function(e) {
            $(e.target).closest('.js-dropdown').toggleClass('is-open');
        });
    };

    Dropdown.prototype.handleEvents = function () {
        $('[data-dropdown]').on('click', function (e) {
            e.preventDefault();

            var targetElement = $(this).attr('data-dropdown');
            $(targetElement).toggleClass('dropdown-target-open');
            $(this).toggleClass('dropdown-open');
            $(this).parent().find(targetElement).toggle();
            $(this).parent().find(targetElement).find('input[data-dropdown-focus]').focus();
        });

        $('body').on('click', function (e) {
            var $target = $(e.target);

            if ($target.closest('.dropdown-target-open').length || $target.closest('[data-dropdown]').length || $target.closest('.backdrop').length) {
                return;
            }

            $('[data-dropdown].dropdown-open').removeClass('dropdown-open');
            $('.dropdown-target-open').toggle();
            $('.dropdown-target-open').removeClass('dropdown-target-open is-highlighted');
        });
    };

    return new Dropdown();

})(jQuery);
