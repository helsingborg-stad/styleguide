@extends('layout.master')

@section('content')
    @markdown
        #TODO: Filtering lists, tables, etc (search)
        Hide elements based on match with data attributes.
    @endmarkdown

    @paper
        @table([
            'list' => [
                ['js-filter-container', 'Container of what should be filterable, has to contain unique id.', 'unique_id'],
                ['js-filter-item', 'The diffrent items that should be filtered through.', ''],
                ['js-filter-data', 'Elements inside item that contain data which should be used in the filter.', ''],
                ['js-filter-input', 'The input for a specific container, has to contain same id as parent.', 'unique_id']
            ],
            'headings' => ['Attribute', 'Description', 'Example value'],
            'showFooter' => false,
            'isSmall' => false
        ])
        @endtable
    @endpaper

@stop
