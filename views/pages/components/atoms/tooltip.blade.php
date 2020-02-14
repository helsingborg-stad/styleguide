@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Tooltip
    @endmarkdown

    @doc(['slug' => 'tooltip'])
    @enddoc
@stop
