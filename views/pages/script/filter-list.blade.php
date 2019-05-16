@extends('layout.master')

@section('content')
    @markdown
        #TODO: Filtering lists (search)
        Hide elements based on match with data attributes.
    @endmarkdown

    @paper
        @table([
            'list' => [
                ['js-bind', 'Event to bind on', 'keyup'],
                ['js-action', 'Should always contain "toggleClass" for css toggling of classes.', 'toggleClass'],
                ['js-toggle-target', 'Target element to toggle the class on, should be a class.', '.somediv'],
                ['js-toggle-class', 'The class to toggle on the target element.', '.is-active']
            ],
            'headings' => ['Attribute', 'Description', 'Example value'],
            'showFooter' => false,
            'isSmall' => false
        ])
        @endtable
    @endpaper

@stop
