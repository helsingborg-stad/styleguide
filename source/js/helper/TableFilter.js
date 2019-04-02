HelsingborgPrime = HelsingborgPrime || {};
HelsingborgPrime.Helper = HelsingborgPrime.Helper || {};

HelsingborgPrime.Helper.TableFilter = (function ($) {

    function TableFilter() {
        $('[data-table-filter]').each(function (index, element) {
            this.init(element);
        }.bind(this));
    }

    TableFilter.prototype.init = function(element) {
        var $list = $(element);
        var listId = $list.attr('data-table-filter');
        var $input = $('[data-table-filter-input="' + listId + '"]');

        $input.on('input', function (e) {
            $list.find('[data-table-filter-empty]').remove();

            $list.find('tbody tr:not([data-table-filter-exclude]):icontains(' + $input.val() + ')').show();
            $list.find('tbody tr:not([data-table-filter-exclude]):not(:icontains(' + $input.val() + '))').hide();

            if ($list.find('tbody tr:not([data-table-filter-exclude]):visible').length === 0 && $list.find('[data-table-filter-empty]').length === 0) {
                $list.find('tbody tr:not([data-table-filter-exclude]):first').before('<tr data-table-filter-empty><td colspan="50">' + HelsingborgPrime.Args.get('tableFilter.empty') + '</td></tr>')
            }
        });
    };

    return new TableFilter();

})(jQuery);
