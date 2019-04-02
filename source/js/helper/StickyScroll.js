//
// @name Local link
// @description  Finds link items with outbound links and gives them outbound class
//
HelsingborgPrime = HelsingborgPrime || {};
HelsingborgPrime.Helper = HelsingborgPrime.Helper || {};

HelsingborgPrime.Helper.StickyScroll = (function ($) {

    var _stickyElements = [];
    var _isFloatingClass = 'is-sticky-scroll';

    function StickyScroll() {
        $(document).ready(function () {
            this.init();
        }.bind(this));
    }

    StickyScroll.prototype.init = function() {
        var $elements = $('.sticky-scroll');

        $elements.each(function (index, element) {
            var $element = $(element);

            _stickyElements.push({
                element: $element,
                offsetTop: $element.offset().top
            })
        });

        $(window).on('scroll', function () {
            this.scrolling();
        }.bind(this));

        this.scrolling();
    };

    /**
     * Runs when scrolling
     * @return {void}
     */
    StickyScroll.prototype.scrolling = function() {
        var scrollOffset = $(window).scrollTop();

        if ($('body').hasClass('admin-bar')) {
            scrollOffset += 32;

            if ($(window).width() < 783) {
                scrollOffset += 14;
            }
        }

        $.each(_stickyElements, function (index, item) {
            if (scrollOffset > item.offsetTop) {
                return this.stick(item.element);
            }

            return this.unstick(item.element);
        }.bind(this));
    };

    /**
     * Makes a element sticky
     * @param  {object} $element jQuery element
     * @return {bool}
     */
    StickyScroll.prototype.stick = function($element) {
        if ($element.hasClass(_isFloatingClass)) {
            return;
        }

        if (!$element.hasClass('navbar-transparent')) {
            this.addAnchor($element);
        }

        $element.addClass(_isFloatingClass);
        return true;
    };

    /**
     * Makes a element non-sticky
     * @param  {object} $element jQuery element
     * @return {bool}
     */
    StickyScroll.prototype.unstick = function($element) {
        if (!$element.hasClass(_isFloatingClass)) {
            return;
        }

        if (!$element.hasClass('navbar-transparent')) {
            this.removeAnchor($element);
        }

        $element.removeClass(_isFloatingClass);
        return true;
    };

    StickyScroll.prototype.addAnchor = function($element) {
        $('<div class="sticky-scroll-anchor"></div>').height($element.outerHeight()).insertBefore($element);
        return true;
    };

    StickyScroll.prototype.removeAnchor = function($element) {
        $element.prev('.sticky-scroll-anchor').remove();
        return true;
    };

    return new StickyScroll();

})(jQuery);
