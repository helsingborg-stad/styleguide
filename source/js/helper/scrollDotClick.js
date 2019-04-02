HelsingborgPrime = HelsingborgPrime || {};
HelsingborgPrime.ScrollDot = HelsingborgPrime.ScrollDot || {};

HelsingborgPrime.ScrollDot.ClickJack = (function ($) {

    var ScrollDotTriggers = [
        '.scroll-dots li a'
    ];

    var ScrollDotTargets = [
        'section',
    ];

    var ScrollDotSettings = {
        scrollSpeed: 450,
        scrollOffset: 0
    };

    function ClickJack() {
        ScrollDotTriggers.forEach(function(element) {
            if($(element).length) {
                $(element).each(function(index,item) {
                    if(this.isAnchorLink($(item).attr('href')) && this.anchorLinkExists($(item).attr('href'))) {
                        this.bindScrollDot(item,$(item).attr('href'));
                    }
                }.bind(this));
            }
        }.bind(this));
    }

    ClickJack.prototype.isAnchorLink = function (href) {
        if(/^#/.test(href) === true && href.length > 1) {
            return true;
        } else {
            return false;
        }
    };

    ClickJack.prototype.anchorLinkExists = function (id) {
        var linkExist = false;
        ScrollDotTargets.forEach(function(element) {
            if($(element + id).length) {
               linkExist = true;
               return true;
            }
        }.bind(this));
        return linkExist;
    };

    ClickJack.prototype.bindScrollDot = function (trigger,target) {
        $(trigger).on('click',function(event){
            event.preventDefault();
            this.updateHash(target);
            var targetOffset = $(target).offset();
            $('html, body').animate({scrollTop: Math.abs(targetOffset.top -Math.abs(ScrollDotSettings.scrollOffset))}, ScrollDotSettings.scrollSpeed);
        }.bind(this));
    };

    ClickJack.prototype.updateHash = function(hash) {
        if(history.pushState) {
            if(hash === "" ) {
                history.pushState(null, null, "#");
            } else {
                history.pushState(null, null, hash);
            }
        } else {
            window.location.hash = hash;
        }
    }

    new ClickJack();

})(jQuery);
