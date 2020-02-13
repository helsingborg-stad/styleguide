@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Icons
        We use the official material-icons npm-package.
    @endmarkdown

    @doc(['slug' => 'icon'])
    @enddoc
@stop