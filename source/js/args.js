//
// @name Language
//
HelsingborgPrime = HelsingborgPrime || {};

HelsingborgPrime.Args = (function ($) {

    function Args() {

    }

    Args.prototype.get = function (s) {
        if (typeof HbgPrimeArgs == 'undefined') {
            return false;
        }

        var o = HbgPrimeArgs;

        s = s.replace(/\[(\w+)\]/g, '.$1');
        s = s.replace(/^\./, '');

        var a = s.split('.');
        for (var i = 0, n = a.length; i < n; ++i) {
            var k = a[i];

            if (k in o) {
                o = o[k];
            } else {
                return false;
            }
        }

        return o;
    };

    return new Args();

})(jQuery);
