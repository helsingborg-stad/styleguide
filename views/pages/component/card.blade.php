@extends('layout.master')

@section('content')

    @markdown
        #Cards

        Nullam quis risus eget urna mollis ornare vel eu leo. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
    @endmarkdown

    @doc(['slug' => 'card'])

        @card(['image' => 'https://picsum.photos/300/200?image=1077'])

            @slot('top')
                @link(['href' => "http://google.se"])
                    @image(['src' => 'https://picsum.photos/300/200?image=1077'])@endimage
                    @image(['src' => 'https://picsum.photos/300/200?image=1077'])@endimage
                @endlink
            @endslot


            @link(['href' => "https://helsingborg.se"])
                I'm a link to the city of Helsingborg
            @endlink

        @endcard



        @card()

            @slot('top')
                Top slot
            @endslot

            Middle slot

            @slot('bottom')
                Bottom slot
            @endslot


        @endcard


    @enddoc
    

@stop




