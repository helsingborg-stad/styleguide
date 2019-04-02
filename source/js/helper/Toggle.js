HelsingborgPrime = HelsingborgPrime || {};
HelsingborgPrime.Helper = HelsingborgPrime.Helper || {};

HelsingborgPrime.Helper.Toggle = (function ($) {

    function Toggle() {
        $('[data-toggle]').on('click', function (e) {
            var toggleTarget = $(this).attr('data-toggle');
            var toggleText = $(this).attr('data-toggle-text');
            var toggleClass = $(this).attr('data-toggle-class');

            // Toggle the target
            var $toggleTarget = $(toggleTarget);
            $toggleTarget.slideToggle(200);

            // Switch text
            $(this).attr('data-toggle-text', $(this).text());
            $(this).text(toggleText);

            // Switch class
            $(this).attr('data-toggle-class', $(this).attr('class'));
            $(this).attr('class', toggleClass);
        });
    }

    return new Toggle();

})(jQuery);
