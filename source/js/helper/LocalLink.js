//
// @name Local link
// @description  Finds link items with outbound links and gives them outbound class
//
HelsingborgPrime = HelsingborgPrime || {};
HelsingborgPrime.Helper = HelsingborgPrime.Helper || {};

HelsingborgPrime.Helper.LocalLink = (function ($) {

    function LocalLink() {
        $(document).ready(function () {
            var hostname = new RegExp(location.host);

            $('a[href].link-item:not(.link-item-outbound):not(.link-unavailable):not([href^="javascript:"]):not([href="#"])').each(function () {
                var url = $(this).attr('href');
                if (hostname.test(url)) {
                    return;
                }

                $(this).addClass('link-item-outbound');
            });
        });
    }

    return new LocalLink();

})(jQuery);
