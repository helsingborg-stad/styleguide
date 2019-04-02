//
// @name Modal
// @description  Prevent scrolling when modal is open (or #modal-* exists in url)
//
HelsingborgPrime = HelsingborgPrime || {};
HelsingborgPrime.Prompt = HelsingborgPrime.Prompt || {};

HelsingborgPrime.Prompt.RevealAnimation = (function ($) {
      var $window         = $(window),
      win_height_padded   = $window.outerHeight(),
      targetWrapper       = '.js-reveal-animation',
      target,
      scrolled        = $window.scrollTop(),
      animationTarget;

    function RevealAnimation() {
      this.init();
    }

    RevealAnimation.prototype.init = function () {
      $( document ).ready(function() {
          this.revealOnScroll();
      }.bind(this));

      $window.on('scroll', this.revealOnScroll);
    };

    RevealAnimation.prototype.revealOnScroll = function () {
        scrolled        = $window.scrollTop();

        $(targetWrapper + ":not(.animated)").each(function() {

        if(!$(this).attr("data-animation")) {
          return;
        }

        animationTarget   = $(this).offset().top,
        animationOffset       = 0.4;

        if (scrolled >= animationTarget - win_height_padded + (win_height_padded * animationOffset)) {
          //console.log(this);
          $(this).addClass($(this).attr("data-animation"));
        }
      });
    };

    return new RevealAnimation();

})(jQuery);
