@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #IconSection__Item
    @endmarkdown

    @doc(['slug' => 'iconSection__item'])
    @enddoc
@stop
