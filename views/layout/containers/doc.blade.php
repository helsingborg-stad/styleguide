@extends('layout.master')

@section('content')
    @include('layout.navigation')
    <div class="container--doc">
        
        <section>
            <article class="article">
                @yield('doc-content')
            </article>
        </section>
        
        @include('layout.footer')
    </div>
@stop