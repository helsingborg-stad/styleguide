@extends('layout.master')

@section('content')
    @markdown
        #Hero
        I'm your hero! I work very well with the slider component. 
    @endmarkdown

    @doc(['slug' => 'hero'])

        @hero(['backgroundImage' => 'https://picsum.photos/900/600?image=993'])
        @endhero

    @enddoc
@stop



