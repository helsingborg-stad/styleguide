//
// @name EqualHeight
// @description  Sets element heights equally to the heighest item
//
// @markup
// <div class="grid" data-equal-container>
//     <div class="grid-md-6" data-equal-item>
//
//     </div>
//     <div class="grid-md-6" data-equal-item>
//
//     </div>
// </div>
//
HelsingborgPrime = HelsingborgPrime || {};
HelsingborgPrime.Helper = HelsingborgPrime.Helper || {};

HelsingborgPrime.Helper.EqualHeight = (function ($) {

    function EqualHeight() {
        // Initialize if flexbox not supported
        if (!this.supportsFlexbox()) {
            
            $(window).on('load', function () {
                this.init();

            }.bind(this));

            $(window).on('resize', function () {
                this.destroy();
                this.init();
            }.bind(this));
        }
    }

    /**
     * Check if browser supports flexbox
     * @return {boolean}
     */
    EqualHeight.prototype.supportsFlexbox = function () {
        if ($('html').hasClass('no-flexbox')) {
            return false;
        }

        return true;
    };

    /**
     * Resets heights to auto
     * @return {void}
     */
    EqualHeight.prototype.destroy = function () {
        $('[data-equal-container] [data-equal-item]').each(function (index, element) {
            $(element).css('height', 'auto');
        }.bind(this));
    };

    /**
     * Intializes equal height
     * @return {void}
     */
    EqualHeight.prototype.init = function () {
        $('[data-equal-container]').each(function (index, element) {
            var maxHeight = this.getMaxHeight(element);
            this.equalize(element, maxHeight);
        }.bind(this));
    };

    /**
     * Get the max height of the items
     * @param  {string} el The parent element
     * @return {integer}   The max height in pixels
     */
    EqualHeight.prototype.getMaxHeight = function (el) {
        var heights = [];

        $(el).find('[data-equal-item]').each(function (index, element) {
            heights.push($(element).outerHeight());
        }.bind(this));

        var maxHeight = Math.max.apply(null, heights);

        return maxHeight;
    };

    /**
     * Set the heights of all items to the max height
     * @param  {string}  parent    The parent element
     * @param  {integer} maxHeight The max height
     * @return {void}
     */
    EqualHeight.prototype.equalize = function(parent, maxHeight) {
        $(parent).find('[data-equal-item]').each(function (index, element) {
            $(element).css('height', maxHeight + 'px');
        }.bind(this));
    };

    return new EqualHeight();

})(jQuery);
