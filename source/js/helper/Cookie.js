//
// @name Cookies
//
HelsingborgPrime = HelsingborgPrime || {};
HelsingborgPrime.Helper = HelsingborgPrime.Helper || {};

HelsingborgPrime.Helper.Cookie = (function ($) {

    function Cookie() {

    }

    /**
     * Sets a cookie
     * @param {string} name      Cookie name
     * @param {string} value     Cookie value
     * @param {void}   daysValid
     */
    Cookie.prototype.set = function (name, value, daysValid) {
        var d = new Date();
        d.setTime(d.getTime() + (daysValid * 24 * 60 * 60 * 1000));

        var expires = "expires=" + d.toUTCString();
        document.cookie = name + "=" + value.toString() + "; " + expires + "; path=/";

        return true;
    };

    /**
     * Gets a cookie
     * @param  {string} name Cookie name
     * @return {mixed}       Cookie value or empty string
     */
    Cookie.prototype.get = function(name) {
        name = name + '=';
        var ca = document.cookie.split(';');

        for (var i=0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }

            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }

        return '';
    };

    /**
     * Destroys/removes a cookie
     * @param  {string} name Cookie name
     * @return {void}
     */
    Cookie.prototype.destory = function(name) {
         this.set(name, '', -1);
         return true;
    };

    /**
     * Check if cookie value is the same as compare value
     * @param  {string} name    Cookie name
     * @param  {string} compare Compare value
     * @return {boolean}
     */
    Cookie.prototype.check = function(name, compare) {
         var value = this.get(name);
         compare = compare.toString();

         return value == compare;
    };

    return new Cookie();

})(jQuery);
