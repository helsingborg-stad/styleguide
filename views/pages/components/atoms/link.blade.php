@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Link    
    @endmarkdown

    @doc(['slug' => 'link'])

    @enddoc
@stop



        