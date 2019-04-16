@extends('layout.master')

@section('content')
    @markdown
        #Link
        A simple link, for link'ish purposes.         
    @endmarkdown

    @doc(['slug' => 'link'])

        @link([
            'href' => 'http://helsingborg.se/?variant=1'
        ])
        A link
        @endbutton

    @enddoc
@stop



        