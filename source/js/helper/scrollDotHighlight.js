HelsingborgPrime = HelsingborgPrime || {};
HelsingborgPrime.ScrollDot = HelsingborgPrime.ScrollDot || {};

HelsingborgPrime.ScrollDot.Highlight = (function ($) {

    var ScrollTopValue = 0;

    var ScrollTopOffset = 0;

    var ScrollMenuWrapperActiveClass = 'current';

    var HighlightTrigger = "section.section-split, section.section-full, section.section-featured";

    var ScrollMenuWrapper = [
        '.scroll-dots'
    ];

    function Highlight() {
        ScrollTopValue = $(window).scrollTop();
        $(window).on('scroll', function (e) {
            var scrolledToItem = null;
            ScrollTopValue = $(window).scrollTop() + ScrollTopOffset + $("#site-header").outerHeight();
            $(HighlightTrigger).each(function (index,item) {
                if(ScrollTopValue >= $(item).offset().top) {
                    scrolledToItem = item;
                    return;
                }
            });
            this.cleanHighlight();
            this.highlightMenuItem("#" + $(scrolledToItem).attr('id'));
        }.bind(this));
    }

    Highlight.prototype.highlightMenuItem = function (id) {
        if(this.isAnchorLink(id) && this.anchorLinkExists(id)){
            this.addWrapperClass('is-active');
            ScrollMenuWrapper.forEach(function(element) {
                $("a[href='" + id + "']", element).addClass(ScrollMenuWrapperActiveClass);
            });
        }
    };

    Highlight.prototype.isAnchorLink = function (href) {
        if(/^#/.test(href) === true && href.length > 1) {
            return true;
        } else {
            return false;
        }
    };

    Highlight.prototype.anchorLinkExists = function (id) {
        var linkExist = false;
        ScrollMenuWrapper.forEach(function(element) {
            if($("a[href='" + id + "']",element).length) {
                linkExist = true;
                return true;
            }
        }.bind(this));
        return linkExist;
    };

    Highlight.prototype.cleanHighlight = function () {
        this.removeWrapperClass('is-active');
        ScrollMenuWrapper.forEach(function(element) {
            $("a",element).removeClass(ScrollMenuWrapperActiveClass);
        }.bind(this));
    };

    Highlight.prototype.addWrapperClass = function (c) {
        ScrollMenuWrapper.forEach(function(element) {
            if(!$(element).hasClass(c)) {
                $(element).addClass(c);
            }
        }.bind(this));
    };

    Highlight.prototype.removeWrapperClass = function (c) {
        ScrollMenuWrapper.forEach(function(element) {
            if($(element).hasClass(c)) {
                $(element).removeClass(c);
            }
        }.bind(this));
    };

    new Highlight();

})(jQuery);
