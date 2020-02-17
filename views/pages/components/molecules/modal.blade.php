@extends('layout.containers.doc')

@section('doc-content')
    @markdown
    #Modal
    Popup for important content and notifications.
    @endmarkdown

    @doc(['slug' => 'modal'])
    @enddoc
@stop
