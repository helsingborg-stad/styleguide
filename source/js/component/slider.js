//
// @name Slider
// @description  Sliding content
//
HelsingborgPrime = HelsingborgPrime || {};
HelsingborgPrime.Component = HelsingborgPrime.Component || {};

HelsingborgPrime.Component.Slider = (function ($) {

    var autoslideIntervals = [];

    function Slider() {
        this.preloadImage();
        this.triggerAutoplay();
        this.pauseAndPlay();
        
        $('.slider').each(function (index, element) {
            var $slider = $(element);

            this.detectIfIsCollapsed(element);

            if ($slider.find('[data-flickity]')) {
                return;
            }

            $slider.flickity({
                cellSelector: '.slide',
                cellAlign: 'center',
                setGallerySize: false,
                wrapAround: true,
            });

        }.bind(this));

        $(window).resize(function() {
            $('.slider').each(function (index, element) {
                this.detectIfIsCollapsed(element);
            }.bind(this));

            this.pauseAndPlayVisibleIcon();

        }.bind(this));
    }

    /**
     * Add collapsed class
     */
    Slider.prototype.detectIfIsCollapsed = function (slider) {
        if ($(slider).width() <= 500) {
            $(slider).addClass("is-collapsed");
        } else {
            $(slider).removeClass("is-collapsed");
        }

        $(slider).find('.slide').each(function (index, slide) {
            if ($(slide).width() <= 500) {
                $(slide).addClass("is-collapsed");
            } else {
                $(slide).removeClass("is-collapsed");
            }
        });
    };

    Slider.prototype.preloadImage = function () {
        setTimeout(function(){

            var normal_img = [];
            var mobile_img = [];

            $(".slider .slide").each(function(index, slide) {

                if ($(".slider-image-mobile", slide).length) {
                    normal_img.index = new Image();
                    normal_img.index.src = $(".slider-image-desktop", slide).css('background-image').replace(/.*\s?url\([\'\"]?/, '').replace(/[\'\"]?\).*/, '');
                }

                if ($(".slider-image-mobile", slide).length) {
                    mobile_img.index = new Image();
                    mobile_img.index.src = $(".slider-image-mobile", slide).css('background-image').replace(/.*\s?url\([\'\"]?/, '').replace(/[\'\"]?\).*/, '');
                }

            });

        },5000);
    };

    Slider.prototype.triggerAutoplay = function () {
        setTimeout(function(){
            $(".slider .slide .slider-video video").each(function(index, video) {
                if (typeof $(video).attr('autoplay') !== 'undefined' && $(video).attr('autoplay') !== 'false') {
                    video.play();
                }
            });
        },300);
    };

    /**
     * Pause & play Visibility
     */
    Slider.prototype.pauseAndPlayVisibleIcon = function () {
        if ($(window).width() > 1024) {
            if ( $('.embeded-mini-toolbar').hasClass('slider-show-on-hover') ) {
                $('.slider').hover(
                    function () {
                        $('.embeded-mini-toolbar').fadeIn(300);
                    },
                    function () {
                        $('.embeded-mini-toolbar').fadeOut(300);
                    }
                );
            }
        }
    };

    /**
     * Pause & play icon on video
     */
    Slider.prototype.pauseAndPlay = function () {

        this.pauseAndPlayVisibleIcon();

        $('.embed-control').on('click', function () {
            event.stopPropagation();
            event.preventDefault();

            var sliderVideoId = $(this).closest('.slide').find('.slider-video').find('video').prop('id');
            var videoPlayer = document.getElementById(sliderVideoId);

            if ($(this).hasClass('embeded-pause')) {
                videoPlayer.pause();
            }

            if ($(this).hasClass('embeded-play')) {
                videoPlayer.play();
            }

            $('.embed-control').each(function() {
                if ($(this).hasClass('hidden')) {
                    $(this).removeClass('hidden');
                }
                else {
                    $(this).addClass('hidden');
                }
            });
        }).bind(this);
    };


    return new Slider();

})(jQuery);
