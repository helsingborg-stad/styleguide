@extends('layout.master')

@section('content')
    @markdown
        #File input
        Displays a file input.
    @endmarkdown

    @doc(['slug' => 'fileinput'])

        @fileinput([
            'display' => 'area',
            'multiple' => true,
            'label' => 'Choose files...'
        ])
        @endfileinput

    @enddoc
@stop
