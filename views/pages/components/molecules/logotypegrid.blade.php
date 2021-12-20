@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Logotype
        Displays a grid of logotypes.
    @endmarkdown

    @doc(['slug' => 'logotypegrid'])
    @enddoc
@stop
