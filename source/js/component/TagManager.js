//
// @name Modal
// @description  Show accodrion dropdown, make linkable by updating adress bar
//
HelsingborgPrime = HelsingborgPrime || {};
HelsingborgPrime.Component = HelsingborgPrime.Component || {};
HelsingborgPrime.Component.TagManager = (function ($) {

    var typingTimer;

    function TagManager() {
        $('.tag-manager').each(function (index, element) {
            this.init(element);
        }.bind(this));

        $(document).on('click', '.tag-manager .tag-manager-selected button[data-action="remove"]', function (e) {
            e.preventDefault();

            var tagElement = $(e.target).closest('li');
            this.removeTag(tagElement);
        }.bind(this));
    }

    /**
     * Initialize tag manager
     * @param  {element} element The tag manager element
     * @return {void}
     */
    TagManager.prototype.init = function(element) {
        var $element = $(element);
        var $button = $element.find('.tag-manager-input [name="add-tag"]');
        var $input = $element.find('.tag-manager-input input[type="text"]');

        $button.on('click', function (e) {
            e.preventDefault();
            var tag = $input.val();
            var tags = tag.split(',');

            $.each(tags, function (index, tag) {
                this.addTag(element, tag.trim());
            }.bind(this));

        }.bind(this));

        $input.on('keypress', function (e) {
            if (e.keyCode !== 13) {
                return;
            }

            e.preventDefault();
            var element = $(e.target).parents('.tag-manager')[0]
            var tag = $input.val();
            var tags = tag.split(',');

            $.each(tags, function (index, tag) {
                this.addTag(element, tag.trim());
            }.bind(this));
        }.bind(this));

        if ($element.attr('data-wp-ajax-action') && typeof ajaxurl !== 'undefined') {
            $input.on('keyup', function (e) {
                clearTimeout(typingTimer);

                typingTimer = setTimeout(function () {
                    this.autocompleteQuery(element);
                }.bind(this), 300);
            }.bind(this));

            $('.tag-manager').on('click', '.autocomplete button', function (e) {
                e.preventDefault();
                var element = $(e.target).closest('button').parents('.tag-manager');
                var tag = $(e.target).closest('button').val();
                var tags = tag.split(',');

                $.each(tags, function (index, tag) {
                    this.addTag(element, tag.trim());
                }.bind(this));
            }.bind(this));
        }
    };

    /**
     * Do ajax autocomplete request
     * @param  {element} element The tag manager element
     * @return {void}
     */
    TagManager.prototype.autocompleteQuery = function(element) {
        var $element = $(element);
        var $input = $element.find('.tag-manager-input input[type="text"]');

        // Return if no search value
        if ($input.val().length === 0) {
            clearTimeout(typingTimer);
            $element.find('.autocomplete').remove();
            return false;
        }

        var ajaxAction = $element.attr('data-wp-ajax-action');
        var data = {
            action: ajaxAction,
            q: $input.val()
        };

        $.post(ajaxurl, data, function (res) {
            if (res.length === 0) {
                return;
            }

            this.showAutocomplete(element, res);
        }.bind(this), 'JSON');
    };

    /**
     * Show the autocomplete element
     * @param  {element} element The tag manager eleement
     * @param  {array} items     The autocomplete items
     * @return {void}
     */
    TagManager.prototype.showAutocomplete = function(element, items) {
        var $element = $(element);
        $element.find('.autocomplete').remove();

        var $autocomplete = $('<div class="autocomplete gutter gutter-sm"><ul></ul></div>');

        $.each(items, function (index, item) {
            $autocomplete.find('ul').append('<li><span class="tag no-padding"><button value="' + item + '">' + item + '</button></span></li>');
        });

        $element.find('.tag-manager-input').append($autocomplete);
    };

    /**
     * Adds a tag to the tag manager selected tags
     * @param {element} element The tag manager element
     * @param {string} tag      The tag name
     */
    TagManager.prototype.addTag = function(element, tag) {
        if (tag.length === 0) {
            return;
        }

        var $element = $(element);
        var inputname = $(element).attr('data-input-name');
        $element.find('.tag-manager-selected ul').append('<li>\
            <span class="tag">\
                <button class="btn btn-plain" data-action="remove">&times;</button>\
                ' + tag + '\
            </span>\
            <input type="hidden" name="' + inputname + '[]" value="' + tag + '">\
        </li>');

        $element.find('.tag-manager-input input[type="text"]').val('');
        $element.find('.autocomplete').remove();
    };

    /**
     * Removes a selected tag
     * @param  {element} tagElement The tag to remove
     * @return {void}
     */
    TagManager.prototype.removeTag = function(tagElement) {
        $(tagElement).remove();
    };

    return new TagManager();

})(jQuery);
