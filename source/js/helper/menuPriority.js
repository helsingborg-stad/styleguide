//
// @name Menu priority
//
HelsingborgPrime = HelsingborgPrime || {};
HelsingborgPrime.Helper = HelsingborgPrime.Helper || {};

HelsingborgPrime.Helper.MenuPriority = (function ($) {

    var $nav = null;
    var $btn = null;
    var $vlinks = null;
    var $hlinks = null;

    var availableSpace = 0;
    var breaks = [];
    var breakWasTwoOrMore = false;

    function MenuPriority() {
        if ($('.header-jumbo').length > 0 && !$('#main-menu').hasClass('nav-justify') && !$('.header-jumbo').hasClass('nav-no-overflow')) {
            this.init();
        }
    }

    MenuPriority.prototype.init = function () {
        $nav = $('#main-menu').parent('.nav-group-overflow');
        $vlinks = $('#main-menu');
        $hlinks = $nav.find('.nav-grouped-overflow');
        $btn = $nav.find('.dropdown-toggle');

        this.updateNavigation();

        $(window).on('resize', function (e) {
            this.updateNavigation();
        }.bind(this));
    };

    MenuPriority.prototype.updateNavigation = function () {
        availableSpace = $btn.is(':visible') ? $nav.parent().first().width() - ($btn.width() + parseFloat($nav.attr('data-btn-width'))) : $nav.parent().first().width();

        if (breaks.length == 1 && breakWasTwoOrMore === true) {
            availableSpace = $nav.parent().first().width();
            breakWasTwoOrMore= false;
        }

        // The visible list is overflowing the available space
        if ($vlinks.width() > 0 && $vlinks.width() > availableSpace) {

            // Record vlinks width
            breaks.push($vlinks.width());

            // Move last element to the grouped items
            $vlinks.children().last().prependTo($hlinks);
            $hlinks.removeClass('hidden');
            $btn.removeClass('hidden').attr('data-item-count', breaks.length);
        } else {

            // Check if there's space to move an item back to the nav
            if (availableSpace > breaks[breaks.length-1]) {
                $hlinks.children().first().appendTo($vlinks);
                breaks.pop();
                $btn.attr('data-item-count', breaks.length);
            }

            if (breaks.length < 1) {
                $hlinks.addClass('hidden');
                $btn.addClass('hidden').attr('data-item-count', breaks.length);
            }
        }

        if (breaks.length > 1) {
            breakWasTwoOrMore = true;
        }

        // Rerun if nav is still overflowing
        if ($nav.is(':visible') && $vlinks.width() > availableSpace && breaks.length > 0 && breaks.length < $vlinks.children('li').length) {
            this.updateNavigation();
        }
    };

    return new MenuPriority();

})(jQuery);
