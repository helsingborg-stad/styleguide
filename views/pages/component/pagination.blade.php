@extends('layout.master')

@section('content')
    @markdown
        #Pagination
    @endmarkdown

    @doc(['slug' => 'pagination'])

        @pagination([
            'list' => [
                ['href' => 'https://helsingborg.se/', 'label' => 'Home'],
                ['href' => 'https://helsingborg.se/bo-bygga-och-miljo/', 'label' => 'Live, Work and enviroment'],
                ['href' => 'https://helsingborg.se/bo-bygga-och-miljo/bostader/', 'label' => 'Housing'],
            ]
        ])
        @endpagination

    @enddoc
@stop



