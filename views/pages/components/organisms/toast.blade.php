@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Toast
        Get the users attention with a toast!
    @endmarkdown

    @doc(['slug' => 'toast'])
    @enddoc
@stop



        