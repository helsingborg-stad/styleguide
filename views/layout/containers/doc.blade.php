@extends('layout.master')

@section('content')
    <div class="container--doc l-docs--content">
        <section>
            <article class="article">
                @yield('doc-content')
            </article>
        </section>
    </div>
@stop