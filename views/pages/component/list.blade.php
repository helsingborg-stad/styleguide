@extends('layout.master')

@section('content')
    @markdown
        #List
        Ordered or unordered lists. Note: Due to reserverd keywords, this internally is called "listing" and not "list". 
    @endmarkdown

    @doc(['slug' => 'listing'])

        @listing([
            'list' => [
                ['href' => 'https://google.se', 'label' => 'Main page'],
                ['href' => 'https://google.se', 'label' => 'Sub page'],
                ['href' => 'https://google.se', 'label' => 'Sub sub page'],
            ],
            'elementType' => "ol"
        ])
        @endlisting

    @enddoc
@stop



        