@extends('layout.master')

@section('content')
    @foreach ($docs as $section)
        <section>
            @include('section')
        </section>
    @endforeach
@stop
