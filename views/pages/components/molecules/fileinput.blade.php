@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #File input
        Displays a file input.
    @endmarkdown

    @doc(['slug' => 'fileinput'])

        @fileinput([
            'classList' => ['unlist'],
            'display' => 'area',
            'multiple' => true,
            'label' => 'Choose files...'
        ])
        @endfileinput

    @enddoc
@stop
