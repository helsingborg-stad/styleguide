//
// @name Cookie consent
//
HelsingborgPrime = HelsingborgPrime || {};
HelsingborgPrime.Prompt = HelsingborgPrime.Prompt || {};

HelsingborgPrime.Prompt.CookieConsent = (function ($) {

    var _cookieConsentVisible = false;
    var _useLocalStorage = true;
    var _animationSpeed = 1000;

    function CookieConsent() {
        this.init();
    }

    CookieConsent.prototype.init = function () {
        try {
            var showCookieConsent = (HelsingborgPrime.Args.get('cookieConsent.show')) ? HelsingborgPrime.Args.get('cookieConsent.show') : true;

            if (showCookieConsent && !this.hasAccepted()) {
                this.displayConsent();

                $(document).on('click', '[data-action="cookie-consent"]', function (e) {
                    e.preventDefault();
                    var btn = $(e.target).closest('button');
                    this.accept();
                }.bind(this));
            }

        } catch(err) {
            console.log(err);
        }
    };

    CookieConsent.prototype.displayConsent = function() {
        var wrapper = $('body');

        if ($('#wrapper:first-child').length > 0) {
            wrapper = $('#wrapper:first-child');
        }

        var consentText = 'This website uses cookies to ensure you get the best experience browsing the website.';
        if (HelsingborgPrime.Args.get('cookieConsent.message')) {
            consentText = HelsingborgPrime.Args.get('cookieConsent.message') ? HelsingborgPrime.Args.get('cookieConsent.message') : 'This website is using cookies to give you the best experience possible.';
        }

        var buttonText = 'Got it';
        if (HelsingborgPrime.Args.get('cookieConsent.button')) {
            buttonText = HelsingborgPrime.Args.get('cookieConsent.button') ? HelsingborgPrime.Args.get('cookieConsent.button') : 'Okey';
        }

        var placement = HelsingborgPrime.Args.get('cookieConsent.placement') ? HelsingborgPrime.Args.get('cookieConsent.placement') : null;

        wrapper.prepend('\
            <div id="cookie-consent" class="notice info gutter gutter-vertical ' + placement + '" style="display:none;">\
                <div class="container"><div class="grid grid-table-md grid-va-middle">\
                    <div class="grid-fit-content"><i class="pricon pricon-info-o"></i></div>\
                    <div class="grid-auto">' + consentText + '</div>\
                    <div class="grid-fit-content text-right-md text-right-lg"><button class="btn btn-primary" data-action="cookie-consent">' + buttonText + '</button></div>\
                </div></div>\
            </div>\
        ');

        $('#cookie-consent').show();
        _cookieConsentVisible = true;
    };

    CookieConsent.prototype.hasAccepted = function() {
        if (_useLocalStorage) {
            return window.localStorage.getItem('cookie-consent');
        } else {
            return HelsingborgPrime.Helper.Cookie.check('cookie-consent', true);
        }
    };

    CookieConsent.prototype.accept = function() {
        $('#cookie-consent').remove();
        _cookieConsentVisible = false;

        if (_useLocalStorage) {
            try {
                window.localStorage.setItem('cookie-consent', true);
                return true;
            } catch(e) {
                return false;
            }
        } else {
            HelsingborgPrime.Helper.Cookie.set('cookie-consent', true, 60);
        }
    };

    return new CookieConsent();

})(jQuery);
