//
// @name Menu
// @description  Function for closing the menu (cannot be done with just :target selector)
//
HelsingborgPrime = HelsingborgPrime || {};
HelsingborgPrime.Helper = HelsingborgPrime.Helper || {};

HelsingborgPrime.Helper.Menu = (function ($) {

    function Menu() {
    	this.init();
    }

    Menu.prototype.init = function () {
	    this.bindEvents();
    };

    Menu.prototype.toggleMenu = function(triggerBtn) {
        triggerBtn.toggleClass('open');

        var target = $(triggerBtn.data('target'));

        if (target.hasClass('nav-toggle-expand')) {
            target.slideToggle();
        } else {
            target.toggleClass('open');
        }

        $('body').toggleClass('mobile-menu-open');
    };

    Menu.prototype.bindEvents = function () {
        $('.menu-trigger').on('click', function (e) {
            e.preventDefault();
            this.toggleMenu($(e.target).closest('.menu-trigger'));
        }.bind(this));
    };

    return new Menu();

})(jQuery);
