//
// @name Modal
// @description  Prevent scrolling when modal is open (or #modal-* exists in url)
//
HelsingborgPrime = HelsingborgPrime || {};
HelsingborgPrime.Prompt = HelsingborgPrime.Prompt || {};

HelsingborgPrime.Prompt.ModalLimit = (function ($) {

    function ModalLimit() {
    	this.init();

        $('[data-action="modal-close"]').on('click', function (e) {
            $(e.target).parents('.modal').removeClass('modal-open').hide();
            $('html').removeClass('overflow-hidden');
            $('body').removeClass('overflow-hidden');
        });
    }

    ModalLimit.prototype.init = function () {
	    this.toggleModalClass();

        $(window).bind('hashchange', function() {
			this.toggleModalClass();
		}.bind(this));

        $('.modal a[href="#close"]').on('click', function (e) {
            $('html').removeClass('overflow-hidden');
            $('body').removeClass('overflow-hidden');
        });
    };

    ModalLimit.prototype.toggleModalClass = function(){
	    if (window.location.hash.indexOf('modal-') > 0 && $(window.location.hash).length > 0) {
			$('html').addClass('overflow-hidden').trigger('openModal');
		} else {
			$('html').removeClass('overflow-hidden').trigger('closeModal');
            $('body').removeClass('overflow-hidden');
		}
    };

    return new ModalLimit();

})(jQuery);
