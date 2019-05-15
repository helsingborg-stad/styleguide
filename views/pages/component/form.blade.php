@extends('layout.master')

@section('content')

    @markdown
        #Form
        Wraps forms
        
    @endmarkdown

    @doc(['slug' => 'form'])

        @form([])
        @endform

    @enddoc

@stop
