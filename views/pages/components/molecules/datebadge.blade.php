@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Datebadge      
    @endmarkdown
    @doc(['slug' => 'datebadge'])
    @enddoc
@stop