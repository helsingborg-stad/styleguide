//
// @name Gallery
// @description  Popup boxes for gallery items.
//
HelsingborgPrime = HelsingborgPrime || {};
HelsingborgPrime.Component = HelsingborgPrime.Component || {};

HelsingborgPrime.Component.GalleryPopup = (function ($) {

    function GalleryPopup() {
    	//Click event
    	this.clickWatcher();
        this.arrowNav();

    	//Popup hash changes
    	$(window).bind('hashchange', function() {
			this.togglePopupClass();
		}.bind(this)).trigger('hashchange');

        //Preload on hover
        this.preloadImageAsset();
    }

    GalleryPopup.prototype.clickWatcher = function () {
	    $('.lightbox-trigger').click(function(event) {
			event.preventDefault();

			//Get data
			var image_href = $(this).attr('href');
            var image_caption = '';

            //Get caption
            if (typeof $(this).attr('data-caption') !== 'undefined') {
                var image_caption = $(this).attr("data-caption");
            }

			//Update hash
			window.location.hash = "lightbox-open";

			//Add markup, or update.
			if ($('#lightbox').length > 0) {
                $('#lightbox-image').attr('src',image_href);
                $('#lightbox .lightbox-image-wrapper').attr('data-caption',image_caption);
                $('#lightbox').fadeIn();
			} else {
				var lightbox =
				'<div id="lightbox">' +
					'<div class="lightbox-image-wrapper" data-caption="' + image_caption + '">' +
						'<a class="btn-close" href="#lightbox-close"></a>' +
						'<img id="lightbox-image" src="' + image_href +'" />' +
					'</div>' +
				'</div>';

				$('body').append(lightbox);
                $('#lightbox').hide().fadeIn();
			}

            $(this).addClass('gallery-active');
            $(this).trigger('openLightBox');
		});

		$(document).on('click', '#lightbox', function () {
			$(this).fadeOut(300).hide(0)
            $('.gallery-active').removeClass('gallery-active');
			window.location.hash = 'lightbox-closed';
            $(this).trigger('closeLightBox');
		});

    };

    GalleryPopup.prototype.togglePopupClass = function (){
	    if (window.location.hash.replace('-', '') == '#lightbox-open'.replace('-', '')) {
			$('html').addClass('gallery-hidden');
		} else {
			$('html').removeClass('gallery-hidden');
		}
    };

    GalleryPopup.prototype.preloadImageAsset = function () {
        $('.image-gallery a.lightbox-trigger').on('mouseenter', function(){
            var img = new Image();
            img.src = jQuery(this).attr('href');
        });
    };

    GalleryPopup.prototype.arrowNav = function () {
        // Keycodes
        var leftArrow = 37;
        var rightArrow = 39;

        $(window).on('keyup', function (e) {
            if (window.location.hash.replace('-', '') != '#lightbox-open'.replace('-', '')) {
                return false;
            }

            if (e.which == leftArrow) {
                this.prevImg();
            } else if (e.which == rightArrow) {
                this.nextImg();
            }
        }.bind(this));
    };

    GalleryPopup.prototype.nextImg = function () {
        var nextImg = $('.gallery-active').parent('li').next().children('a');
        if (nextImg.length == 0) {
            nextImg = $('.gallery-active').parents('ul').children('li:first-child').children('a');
        }

        $('#lightbox').trigger('click');
        setTimeout(function () {
            nextImg.trigger('click');
        }, 100);
    };

    GalleryPopup.prototype.prevImg = function () {
        var prevImg = $('.gallery-active').parent('li').prev().children('a');
        if (prevImg.length == 0) {
            prevImg = $('.gallery-active').parents('ul').children('li:last-child').children('a');
        }

        $('#lightbox').trigger('click');
        setTimeout(function () {
            prevImg.trigger('click');
        }, 100);
    };

    new GalleryPopup();

})(jQuery);
