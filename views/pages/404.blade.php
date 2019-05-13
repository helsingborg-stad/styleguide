@extends('layout.master')

@section('hero')
    @hero([
        'backgroundColor' => '#fff',
        'headline' => 'Whoops!', 
        'byline' => 'Error 404', 
        'textColor' => 'dark'
    ])

    @slot('content')
        We cannot find that, have you looked in the refrigerator? 
    @endslot

    @endhero
@endsection

@section('content')
    <h1>404 - Page cannot be found</h1>
    <p>This page dosen't exists.</p>
    <pre><code>{{$errorMessage}}</code></pre>
@stop
