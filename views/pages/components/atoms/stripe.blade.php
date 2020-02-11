@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        # Stripe
    @endmarkdown

    @doc(['slug' => 'stripe'])
        @stripe
        @endstripe
    @enddoc
@stop
