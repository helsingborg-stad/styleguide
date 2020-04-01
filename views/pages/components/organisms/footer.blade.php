@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Footer
    @endmarkdown


    @doc(['slug' => 'footer'])
    @enddoc
@stop