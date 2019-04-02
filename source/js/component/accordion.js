//
// @name Modal
// @description  Show accodrion dropdown, make linkable by updating adress bar
//
HelsingborgPrime = HelsingborgPrime || {};
HelsingborgPrime.Component = HelsingborgPrime.Component || {};

HelsingborgPrime.Component.Accordion = (function ($) {

    function Accordion() {
        this.init();
    }

    Accordion.prototype.init = function () {
        
        var click = false;

        $(document).on('focus', '.accordion-toggle', function(e) { 
                        
            if(!click)
            {
                $(this).parent().find('.accordion-content').show();
                $(this).addClass("minus");
            }

            click = false;
                
        });
                
                
        $(document).on('mousedown', '.accordion-toggle', function(e) { 

            click = true;

            $(this).parent().find('.accordion-content').toggle();
            
            $(this).toggleClass("minus");
            
            $(this).blur();

        });

        $('.accordion-search input').on('input', function (e) {

            var where = $(e.target).parents('.accordion');
            var what = $(e.target).val();

            this.filter(what, where);
        }.bind(this));
    };

    Accordion.prototype.filter = function(what, where) {
        where.find('.accordion-section').find('.accordion-content').hide();
        where.find('.accordion-section').find('.accordion-toggle').removeClass('minus');

        if(what != '')
        {
            where.find('.accordion-section:icontains(' + what + ')').find('.accordion-content').show();

            if(!where.find('.accordion-section:icontains(' + what + ')').find('.accordion-toggle').hasClass('minus')){
                where.find('.accordion-section:icontains(' + what + ')').find('.accordion-toggle').addClass('minus');
            }
        }
        
    };

    return new Accordion();

})(jQuery);
