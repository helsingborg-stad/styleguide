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

HelsingborgPrime.Helper.Post = (function ($) {

    function Post() {
        this.bindEvents();
    }

    Post.prototype.bindEvents = function() {
        $(document).on('click', '.post-collapsed article', function (e) {
            $(e.target).closest('article').parents('.post-collapsed').addClass('post-expanded');
        }.bind(this));
    };

    return new Post();

})(jQuery);
