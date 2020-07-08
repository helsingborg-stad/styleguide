import TheDatepicker from './the-datepicker';

const datepickers = document.querySelectorAll('[js-datepicker="1"]');

if (datepickers.length > 0) {
    datepickers.forEach(element => {
        const datepicker = new TheDatepicker.Datepicker(element);

        datepicker.options.setInputFormat('j/n/Y');
        datepicker.options.setTitle(element.getAttribute('c-datepicker-title'));
        datepicker.options.setDaysOutOfMonthVisible(
            element.getAttribute('c-datepicker-showdaysoutofmonth')
        );
        datepicker.options.setShowResetButton(element.getAttribute('c-datepicker-showresetbutton'));
        datepicker.options.setShowDeselectButton(
            element.getAttribute('c-datepicker-showclearbutton')
        );
        datepicker.options.setHideOnBlur(element.getAttribute('c-datepicker-hideonblur'));
        datepicker.options.setHideOnSelect(element.getAttribute('c-datepicker-hideonselect'));
        datepicker.options.setMinDate(element.getAttribute('c-datepicker-min'));
        datepicker.options.setMaxDate(element.getAttribute('c-datepicker-max'));

        datepicker.render();
    });
}
