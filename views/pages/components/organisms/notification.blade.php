@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Notification      
    @endmarkdown

    @doc(['slug' => 'notification'])
    @enddoc
@stop