@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        # Testimonials
    @endmarkdown

    @doc(['slug' => 'testimonials'])
    @enddoc

@stop
