@extends('layout.master')

@section('content')
    @markdown
        # Stripe
    @endmarkdown

    @doc(['slug' => 'stripe'])
        @stripe
        @endstripe
    @enddoc
@stop
