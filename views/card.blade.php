@extends('layout.master')

@section('content')
    <h1>Card</h1>
    <p>The card component.</p>

    {!! 
        component('button', [
            'isDisabled' => true,
            'label' => "Test"
        ]) 
    !!}


@stop
