@extends('layout.master')

@section('content')
    <div class="container--home">
        @yield('hero')
        
        <section>
            <article class="article">
                @yield('home-content')
            </article>
        </section>
        
        @include('layout.footer')
    </div>
@stop