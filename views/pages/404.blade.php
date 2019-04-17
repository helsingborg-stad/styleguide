@extends('layout.master')

@section('content')
    <h1>404 - Page cannot be found</h1>
    <p>This page dosen't exists.</p>
    <pre><code>{{$errorMessage}}</code></pre>
        
        @icon(['icon' => 'home', 'label' => 'Mutch icon, wow!'])
        @endicon

        

@stop
