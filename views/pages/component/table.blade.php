@extends('layout.master')

@section('content')
    @markdown
        #Table
    @endmarkdown

    @doc(['slug' => 'table'])

        @table([
            'list' => [
                ['Hello', 'Hi!', 'Howdy'],
                ['Goodbye', 'Bye', 'See ya!']
            ],
            'headings' => ['Formal', 'Casual', 'Redneck'],
            'showFooter' => true
        ])
        @endtable

    @enddoc
@stop



