@extends('layout.master')
@include('layout.navigation')

@section('content')
    <div class="container--doc">
        
        <section>
            <article class="article">
                @yield('doc-content')
            </article>
        </section>
        
        @include('layout.footer')
    </div>
@stop