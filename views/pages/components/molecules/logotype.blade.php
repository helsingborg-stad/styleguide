@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Logotype
        Displays a logotype. If it is missing it may be replaced with a placeholder. Alt and captions can be added.
    @endmarkdown

    @doc(['slug' => 'logotype'])
    @enddoc
@stop
