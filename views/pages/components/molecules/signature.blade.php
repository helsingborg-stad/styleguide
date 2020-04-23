@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Signature
    @endmarkdown

    @doc(['slug' => 'signature'])
    @enddoc
@stop